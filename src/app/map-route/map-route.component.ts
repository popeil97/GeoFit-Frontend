import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, RendererFactory2, ViewContainerRef, ApplicationRef } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { UserProfileService } from '../userprofile.service';
//import * as L from 'leaflet';
//import * as markercluster from 'leaflet.markercluster';
import { PopUpService } from '../pop-up.service';
import { UserFollowComponent } from '../user-follow/user-follow.component';
import { RoutePinDialogComponent } from '../route-pin-dialog/route-pin-dialog.component';
import { MapService } from '../map.service';

import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.heat';

const L = window['L'];
var heat = window['heat']

import * as _ from 'lodash';
import * as turf from '@turf/turf';
import { ListKeyManager } from '@angular/cdk/a11y';
import { AppComponent } from '../app.component';
import { PopupComponent } from '../popup/popup.component';
import { RaceService } from '../race.service';

@Component({
  selector: 'app-map-route',
  templateUrl: './map-route.component.html',
  styleUrls: ['./map-route.component.css']
})
export class MapRouteComponent implements OnChanges {
  @Input() map;

  @Input() raceID: number;
  @Input() coordinates;
  @Input() displayUsers:Boolean;
  @Input() followedIDs:any;
  @Input() zoom:Boolean;

  @Input() orgData: UserData[];
  @Input() userData: UserData[];
  @Input() routePins: RoutePins[];
  
  private line:any;
  private coordsRoutes:any[];
  private myUserDataIdx: number;

  private markersByUserID = {};
  private markerClusters:any;
  private orgMarkerClusters:any;
  private routePinMarkers:any;
  private layerIDsToUserIndices = {};
  private layerIDsToOrgIndices = {};

  private myMarker: any;

  private marker_start:any;
  private marker_end:any;

  //We extend the Marker class to set our own 'routePinIndex' option
  private routePinMarker = L.Marker.extend({
    options: {
      routePinIndex: 0,
    }
  });

  constructor(
    private popupService:PopUpService, 
    private _profileService:UserProfileService,
    private _mapService: MapService,
    private _raceService:RaceService,
    public dialog: MatDialog) { 
      this.coordsRoutes = [];
    }


  ngOnChanges(changes: SimpleChanges) {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
         console.log("map-route:race-id", this.raceID);
        switch(propName) {
          case 'coordinates':
            if (this.coordinates){
             // console.log("coordinates: ", this.coordinates);
              this.applyCoordinates();
            }

          case 'routePins':
            if (this.routePins && this.displayUsers){
             // console.log("route pins: ", this.routePins);
              this.createRoutePins();
            }

          case 'userData':
            if (this.userData && this.displayUsers){
          //    console.log("NEW USER DATA IN MAP-ROUTE COMP:");
          //    console.log("userData: ", this.userData);
              this.createUserPins(false);
            }
            
        }

      }
    }
  }

  public panToUserMarker(user_id, showPopUp=true){
    //Do this to pan *and* zoom
    console.log("ZOOM ZOOM IN MAP-ROUTE");
    var markerBounds = L.latLngBounds([this.markersByUserID[user_id.toString()]['latLng']]);
  //  console.log("In pan to user marker for user ID ", user_id);
    
    //Gotta do an event up to map to pan to the bounds in var above
  }

  private applyCoordinates():void {
    //ugly but neccessary way of adding start pins and paths to map
    var temp_routes = [];
    var temp_coords = [];
    var temp_routes_flipped = [];
    var temp_coords_flipped = [];

    _.forEach(this.coordinates,(route) => {
      temp_coords = [];
      temp_coords_flipped = [];

      _.forEach(route.coords, (coord) => {
        temp_coords.push([coord[0], coord[1]]);
        temp_coords_flipped.push([coord[1], coord[0]]);
      })

      temp_routes.push(temp_coords);
      temp_routes_flipped.push(temp_coords_flipped);
    });

    let start_coord = temp_routes_flipped[0][0];
    let final_route = temp_routes_flipped[temp_routes_flipped.length-1];
    let end_coord = final_route[final_route.length-1];

    let begin = new L.LatLng(start_coord[0], start_coord[1]);
    let finish = new L.LatLng(end_coord[0], end_coord[1]);
    let bounds = new L.LatLngBounds(begin, finish);

    this.map.fitBounds(bounds, { padding: [15, 15] });

    const lat = 29.651634;
    const lon = -82.324829;
    this.marker_start = L.marker(start_coord,{icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [10, 40],
      popupAnchor: [18, -40],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    })}).addTo(this.map);

   // this.marker_start.bindPopup(this.popupService.makePopup({name:'Start',state:''}));

    this.marker_end = L.marker(end_coord,{icon: L.icon({
      iconSize: [ 38, 36 ],
      iconAnchor: [10, 40],
      popupAnchor: [18, -40],
      iconUrl: 'https://tucan-prod-bucket.s3-us-west-2.amazonaws.com/media/endflag.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    })}).addTo(this.map);

  //  this.marker_end.bindPopup(this.popupService.makePopup({name:'End',state:''}));

    if(this.zoom)
    {
      console.log("ZOOM ZOOM IN MAP");
      this.map.setZoom(9);
    }
    
    
    var color = "blue";

    //Add each path to map independently
    _.forEach(temp_routes_flipped,(route) => {
      this.line = L.polyline(route,{
        color: color,
        weight: 8,
        opacity: 0.65
      }).addTo(this.map);
    });

    //We store coordinates in their original order 
    //so we can work out user progression along route later
    let count = 1;
    _.forEach(temp_routes, (route) => {
      let name = 'route' + count.toString();
      this.coordsRoutes.push(turf.lineString(route, { name: name }));
      count += 1;
    })
  }

  private union_arrays (x, y) {
    var obj = {};
    for (var i = x.length-1; i >= 0; -- i)
       obj[x[i]] = x[i];
    for (var i = y.length-1; i >= 0; -- i)
       obj[y[i]] = y[i];
    var res = []
    for (var k in obj) {
      if (obj.hasOwnProperty(k))  // <-- optional
        res.push(obj[k]);
    }
    return res;
  }


  public showPinsFromSettings(settings: PinSettings){
    //If showing org pins, this overrides all other settings
    if (settings.showOrgPins){
      this.createOrgPins();
      return;
    }

    //If we instead wish to show all user pins, simply call createUserPins()
    if (settings.allAgesOn && settings.malePinsOn && settings.femalePinsOn && !settings.followerPinsOnly){
      this.createUserPins(false);
      return;
    }

    //If user selects more granular options, we have to collect IDs corresponding to users
    //within user selection bounds, and plot the pins of only these users
    
    let unionIDs = [];
    let maleIDs = [];
    let femaleIDs = [];
    
    //We do this so if both M and F are checked, people of all genders
    //are displayed
    if (!settings.malePinsOn || !settings.femalePinsOn){
      if (settings.malePinsOn){
        maleIDs = this.getIDsByGender('Male');
      }
      if (settings.femalePinsOn){
        femaleIDs = this.getIDsByGender('Female');
      }

   //   console.log("female IDs: ", femaleIDs);
      
      unionIDs = maleIDs.concat(femaleIDs);
   //   console.log("Union IDs: ", unionIDs);

    }

    //Limit to only users we follow
    if (settings.followerPinsOnly){
      if (unionIDs.length){
        unionIDs = unionIDs.filter(value => this.followedIDs.includes(value));
      }
      else {
        unionIDs = this.followedIDs;
      }
    }

    //Limit by age group
    if (!settings.allAgesOn){
      let ageIDs = this.getIDsInAgeRange(settings.minAge, settings.maxAge);
      if (unionIDs.length){
        unionIDs = unionIDs.filter(value => ageIDs.includes(value));
      }
      else {
        unionIDs = ageIDs;
      }
    }

 //  console.log("Union IDs: ", unionIDs);

    this.showPinsByID(unionIDs, false);
  }

  public showAllPins(){
    this.showPinsByID(null, true);
  }


  public getIDsInAgeRange(minAge: number, maxAge: number){
    let IDs = [];
    for (let i = 0; i < this.userData.length; i++){
      if (this.userData[i].age >= minAge && this.userData[i].age <= maxAge){
        IDs.push(this.userData[i].user_id);
      }
    }

    return IDs;
  }


  public getIDsByGender(gender: string){
    let IDs = [];
    for (let i = 0; i < this.userData.length; i++){
      if (this.userData[i].gender == gender){
        IDs.push(this.userData[i].user_id);
      }
    }

    return IDs;
  }


  public clearUserPins(){
    //Remove all current user pins
    if (this.markerClusters){
      this.map.removeLayer(this.markerClusters);
    }
  }

  
  public clearOrgPins(){
    if (this.orgMarkerClusters){
      this.map.removeLayer(this.orgMarkerClusters);
    }
  }


  public showPinsByID(IDs, showAll: boolean){
    //Clear all user and org pins
    this.clearUserPins();
    this.clearOrgPins();

    let viewComponent = this;

    this.map.removeLayer(this.markerClusters);

    this.markerClusters.eachLayer(function(layer) {
      let tempUserDataIndex = viewComponent.layerIDsToUserIndices[layer._leaflet_id.toString()];
      let tempUserData = viewComponent.userData[tempUserDataIndex];
      let pinUserID = tempUserData.user_id;

      if (showAll == true || IDs.includes(pinUserID)){
        layer.addTo(viewComponent.map);
      }
      else {
        layer.remove();
      }
    });
  }


  public createMarkerClusterGroup(maxMarkers: number){
    return L.markerClusterGroup({
      //disableClusteringAtZoom: 12, //12
      maxClusterRadius: 20, //20
      animateAddingMarkers: true,
      iconCreateFunction: function(cluster){
          var markers = cluster.getAllChildMarkers();

          //Maximum of 4 imgs per cluster (choose first 4 children)
          var markersInCluster = Math.min(maxMarkers, markers.length);

          var inner_html = '';

          for (let i = 0; i < markersInCluster; i++){
            var img_class = 'pos' + (i).toString() + 'of' + markersInCluster.toString();

            var content = markers[i]['options']['icon']['options']['html']
            var regex = /<img.*?src=['"](.*?)['"]/;
            var img_src = regex.exec(content)[1];

            inner_html += "<img class=\"" + img_class + "\" src=\"" + img_src + "\">"
          }

          //Remember to add the pin to the cluster pin
          inner_html += '<div class="pin"></div>';

          var divClass = 'cluster-pin-' + markersInCluster.toString();

          return L.divIcon({
            className: divClass,
            html: inner_html,
            iconSize: [30, 30],
            iconAnchor: [10, 33],
            popupAnchor: [0, -62],
          });
        }
    });
  }


  //Updates the logged in users stat and recreates *all* pins
  public updateMyUserStatAndCreatePins(){
    //Update our user data item in array
  //  console.log("Getting new user stat for race ID ", this.raceID);
    this._raceService.getTeamOrUserStat(this.raceID).then((data) => {
      let userData = data as UserData;
      this.userData[this.myUserDataIdx] = userData;

      //Reshow all pins
      this.createUserPins(false);
    });
  }


  public createUserPins(heatMapOn){
    //Clear all user and org pins
    this.clearUserPins();
    this.clearOrgPins();

 //   console.log("USER DATA IN MAP ROUTE COMP: ", this.userData);

    //Set max number of markers in a cluster and set up clustering
    var maxMarkersInCluster = 4;
    this.markerClusters = this.createMarkerClusterGroup(maxMarkersInCluster);

    //var heatArray = new Array(this.userData.length);

    //Iterate over user data, create and show pins and retain map of leaflet ID -> user idx
    for (var i = 0; i < this.userData.length; i++){
      // heatArray[i] = [lat_user,lng_user,1]
      // heatArray[i+this.userData.length] = [lat_user,lng_user,1.0]
      let user_leaflet_id = this.createPin(this.userData[i]);
      this.layerIDsToUserIndices[user_leaflet_id] = i;

      if (this.isMe(this.userData[i])){
        this.myUserDataIdx = i;
      }
    }

    //Add pin clusters to map
    this.map.addLayer(this.markerClusters);

    //Bind everybody's Popupcomponent to their Popup
    //If popup is ours, we open it up by default
    let thisComponent = this;
    this.markerClusters.eachLayer(function(layer) {
      let tempUserDataIndex = thisComponent.layerIDsToUserIndices[layer._leaflet_id.toString()];
      let tempUserData = thisComponent.userData[tempUserDataIndex];

      layer.bindPopup( layer => { const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
                                      popupEl.userData = tempUserData;
                                      document.body.appendChild(popupEl);
                                      return popupEl}, {
                                        'autoClose': false,
                                      })

      if (layer._leaflet_id == Object.keys(thisComponent.myMarker._layers)[0]){
        thisComponent.markerClusters.zoomToShowLayer(layer, function() {
          layer.openPopup();
        });
      }
    })

    //Handle marker onclick events (open popups)
    this.markerClusters.on('click', function(ev) {
      if (!ev.layer.getPopup()._isOpen){
        //Open popup if it is already binded
        ev.layer.getPopup().openPopup();
      }

      else {
        //If popup open before click, close it
        ev.layer.getPopup().closePopup();
      }

    });

    // heatArray = heatArray.map(function (p) { return [p[0], p[1]]; });

    // if(heatMapOn)
    // {
    //   try{
    //     heat.remove();
    //   }
    //   catch(ex){}
      
    //   heat = L.heatLayer(heatArray, {radius: 50},{minOpacity: 1.0}).addTo(this.map);
    // }
    // else
    // {
    //   try{
    //     heat.remove();
    //   }
    //   catch(ex){}
    // }
  }

  
  public createOrgPins() {
  //  console.log("Creating org pins");

    //Clear all user and org pins
    this.clearUserPins();
    this.clearOrgPins();

    //Set max number of markers in a cluster and set up clustering
    var maxMarkersInCluster = 4;
    this.orgMarkerClusters = this.createMarkerClusterGroup(maxMarkersInCluster);

    //Iterate over user data, create and show pins and retain map of leaflet ID -> user idx
    for (var i = 0; i < this.orgData.length; i++){
    //  console.log("Creating pin with data ", this.orgData[i]);
      let user_leaflet_id = this.createPin(this.orgData[i], true);
      this.layerIDsToOrgIndices[user_leaflet_id] = i;
    }

    //Add pin clusters to map
    this.map.addLayer(this.orgMarkerClusters);

    //Bind everybody's Popupcomponent to their Popup
    //If popup is ours, we open it up by default
    let thisComponent = this;
    this.orgMarkerClusters.eachLayer(function(layer) {
      let tempOrgDataIndex = thisComponent.layerIDsToOrgIndices[layer._leaflet_id.toString()];
      let tempOrgData = thisComponent.orgData[tempOrgDataIndex];

      layer.bindPopup( layer => { const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
                                      popupEl.userData = tempOrgData;
                                      popupEl.isTag = true;
                                      document.body.appendChild(popupEl);
                                      return popupEl}, {
                                        'autoClose': false,
                                      })
    })

    //Handle marker onclick events (open popups)
    this.orgMarkerClusters.on('click', function(ev) {
      if (!ev.layer.getPopup()._isOpen){
        //Open popup if it is already binded
        ev.layer.getPopup().openPopup();
      }

      else {
        //If popup open before click, close it
        ev.layer.getPopup().closePopup();
      }

    });
  }
  

  public createPin(userData: UserData, isTag: boolean=false){
    var img_html = "<img src=\"" + userData.profile_url + "\";\"><div class=\"pin\"></div><div class=\"pulse\"></div>";

    var userIcon = L.divIcon({
      className: 'location-pin',
      html: img_html,
      iconSize: [30, 30],
      iconAnchor: [10, 33],
      popupAnchor: [0, -62],
    });

    var user_rel_miles = userData.rel_distance;
    var user_route_idx = userData.route_idx;

    //Get user's distance type for turf
    var distanceTypeOptions;
    if (userData.distance_type == 'MI'){
      distanceTypeOptions = {units: 'miles'};
    }
    else {
      distanceTypeOptions = {units: 'kilometers'};
    }

    var along_user = turf.along(this.coordsRoutes[user_route_idx], user_rel_miles, distanceTypeOptions);

    var lng_user = along_user.geometry.coordinates[0];
    var lat_user = along_user.geometry.coordinates[1];

    var locMarker = L.geoJSON(along_user, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: userIcon });
      }
    })

    if (isTag){
      this.orgMarkerClusters.addLayer(locMarker);
    }
    else {
      //Get user ID of this race stat
      let elementID = userData.user_id;

      this.markerClusters.addLayer(locMarker);

      //Retain markers in dict so we can pan to it upon select
      this.markersByUserID[elementID] = {
          'locMarker' : locMarker,
          'latLng' : L.latLng(lat_user, lng_user),
      };

      //If this pin is current user, pan and zoom to it
      if (this.isMe(userData)){
        this.myMarker = this.markersByUserID[elementID]['locMarker'];
        this.panToUserMarker(elementID);
      }
    }

    //Return leaflet id
    let user_leaflet_id = Object.keys(locMarker._layers)[0].toString()
    return user_leaflet_id;
  }


  private isMe(userData: any){
    if (userData.isMe){
      return true;
    }
    else if (userData.child_user_stats){
      for (let i = 0; i < userData.child_user_stats.length; i++){
        if (userData.child_user_stats[i].isMe){
          return true;
        }
      }
    }

    return false;
  }


  private openRoutePinDialogueWithIndex(index: number, thisComponent: any){
    let dialogRef = thisComponent.dialog.open(RoutePinDialogComponent, {
      data: { 
        'title': thisComponent.routePins[index].title,
        'description': thisComponent.routePins[index].description,
        'image_urls': thisComponent.routePins[index].image_urls,
      },
    });
  }


  private createRoutePins(){
    this.routePinMarkers = new L.featureGroup();

    for (let i = 0; i < this.routePins.length; i++){
      var img_html = "<img src=\"" + this.routePins[i].image_urls[0] + "\";\"><div class=\"rounded-pin\"></div>";
      var userIcon = L.divIcon({
        className: 'route-pin',
        html: img_html,
        iconSize: [30, 30],
        iconAnchor: [10, 33],
        popupAnchor: [0, -62],
      });  

      var latlng = new L.LatLng(this.routePins[i].lat, this.routePins[i].lon);

      var routeMarker = new this.routePinMarker(latlng, { 
        icon: userIcon,
        routePinIndex: i });

      this.routePinMarkers.addLayer(routeMarker);
    }

    this.routePinMarkers.addTo(this.map);

    //Handle marker onclick events (open popups)
    let thisComponent = this;
    this.routePinMarkers.on('click', function(ev) {
      thisComponent.openRoutePinDialogueWithIndex(ev.layer.options.routePinIndex, thisComponent);
    });
    
  }





}

interface PinSettings {
  followerPinsOnly: boolean;
  malePinsOn: boolean;
  femalePinsOn: boolean;
  allAgesOn: boolean;
  minAge: number;
  maxAge: number;
  showOrgPins: boolean;
}

interface RoutePins {
  title: string;
  desciption: string;
  lon: number;
  lat: number;
  image_urls: string[];
}

interface MapData {
  coords: any;
  route_pins: RoutePins[];
}

interface UserData {
  user_id: number,
  total_distance: number,
  distance_type: string,
  rel_distance: number,
  route_idx: number,
  display_name: string,
  profile_url: string,
  follows: boolean,
  child_user_stats: any[],
  isTeam: boolean,
  isMe: boolean,
  gender: string,
  age: number,

  email:string,
  description: string,
  location:string,
}

interface OrgPinData {
  org_pins: UserData[];
}