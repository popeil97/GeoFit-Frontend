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
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit,OnChanges {
  @Input() coordinates;
  @Input() draw:Boolean;
  @Input() displayUsers:Boolean;
  @Input() followedIDs:any;
  @Input() zoom:Boolean;
  @Input() raceID:number;

  private orgData: UserData[];
  private userData: UserData[];
  private myUserDataIdx: number;

  private routePins: RoutePins[];

  public map;
  private line:any;
  private coordsRoutes:any[];

  private markersByUserID = {};
  private markerClusters:any;
  private orgMarkerClusters:any;
  private routePinMarkers:any;
  private layerIDsToUserIndices = {};
  private layerIDsToOrgIndices = {};

  private myMarker: any;

  private marker_start:any;
  private marker_end:any;

  private user_team_or_stat:any;

  private initialized: boolean = false;

  //Store user IDs of male and female pins
  private maleIDs: number[];
  private femaleIDs: number[];

  loading:boolean = false;

  //We extend the Marker class to set our own 'routePinIndex' option
  private routePinMarker = L.Marker.extend({
    options: {
      routePinIndex: 0,
    }
  });


  constructor(private popupService:PopUpService, 
              private _profileService:UserProfileService,
              private _mapService: MapService,
              private _raceService:RaceService,
              public dialog: MatDialog) {
    this.coordsRoutes = [];
    Window["mapComponent"] = this;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized){
      for(const propName in changes) {
        if(changes.hasOwnProperty(propName)) {
          switch(propName) {
            case 'raceID':
              this.getMapData();
          }
        }
      }
    }
  }


  ngAfterViewInit(): void {
    if(this.map == undefined) {
      this.initMap();
    }

    //This ensures we can still use homepage coords if provided via Input
    if (!this.coordinates){
      this.getMapData();
    }
    else {
      this.applyCoordinates();
    }

    this.initialized = true;
  }


  public getMapData(){

    this.userData = [];
    let workers = [] as any;

    this._mapService.getUserPinSize(this.raceID).then((resp) => {
      console.log('USER PIN SIZE RESP:',resp);
      let pages = resp['pages'];

      for(var page = 1; page <= pages; page++) {
        let worker = this.getUserPinData(page);
        workers.push(worker);
      }

      console.log('WORKERS:',workers)

      // Promise.all(workers).then((vals:any) => {
      //   console.log('DONE LOADING PINS:',vals)
      //   vals.forEach((val) => {
      //     this.userData = this.userData.concat(val['users_data']);
      //   });

      //   console.log('ALL USERS DATA:',this.userData)

      //   if (this.displayUsers){
      //     this.createUserPins(false);
      //   }
      //   this.loading = false;
      // })
    });

    

    this._mapService.getOrgPinStats(this.raceID).then((data) => {
      console.log('ORG PINSSSS DATAAAAA',data);
      let orgPinData = data as OrgPinData;
      this.orgData = orgPinData.org_pins;
    })
    
    this._mapService.getMapData(this.raceID).then((data) => {
      let mapData = data as MapData;

      //Get and apply coordinates
      this.coordinates = mapData.coords;
      this.applyCoordinates();

      //Get and apply route pins
      this.routePins = mapData.route_pins;
      

      this.loading=true;

      
    });

  }

  public getUserPinData(page:number) {
    console.log('getting user data')
    return this._raceService.getUserRacestats(this.raceID,page).then((data) =>{
      this.userData = this.userData.concat(data['users_data']);

      if (this.displayUsers){
        this.createUserPins(false);
      }
      this.loading = false;
    });
  }


  public panToUserMarker(user_id, showPopUp=true){
    //Do this to simply pan to user pin
    //this.map.panTo(this.markersByUserID[user_id.toString()]['latLng']);

    //Do this to pan *and* zoom
    var markerBounds = L.latLngBounds([this.markersByUserID[user_id.toString()]['latLng']]);
    var options = {'maxZoom': 15, 'animate': true, 'easeLinearity': 0.1}
    this.map.fitBounds(markerBounds, options);
  }


  public panToUSA(){
    var corner1 = L.latLng(40.4, -73.7);
    var corner2 = L.latLng(39.79, -75.5);
    var markerBounds = L.latLngBounds(corner1,corner2);
    var options = {'maxZoom': 15, 'animate': true, 'easeLinearity': 0.1}
    this.map.fitBounds(markerBounds, options);
  }


  public panToIsrael(){
    var corner1 = L.latLng(31.8,35.3);
    var corner2 = L.latLng(31.76, 35.18);
    
    var markerBounds = L.latLngBounds(corner1,corner2);
    var options = {'maxZoom': 15, 'animate': true, 'easeLinearity': 0.1}
    this.map.fitBounds(markerBounds, options);
  }


  public clearMap(): void {
    if(this.marker_start && this.marker_end && this.line) {
      this.map.removeLayer(this.marker_start);
      this.map.removeLayer(this.marker_end);
      this.map.removeLayer(this.line);
    }
  }


  private applyCoordinates():void {
    if(!this.map) {
      this.initMap()
    }

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

    this.marker_start.bindPopup(this.popupService.makePopup({name:'Start',state:'Jerusalem'}));

    this.marker_end = L.marker(end_coord,{icon: L.icon({
      iconSize: [ 38, 36 ],
      iconAnchor: [10, 40],
      popupAnchor: [18, -40],
      iconUrl: 'https://tucan-prod-bucket.s3-us-west-2.amazonaws.com/media/endflag.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    })}).addTo(this.map);

    this.marker_end.bindPopup(this.popupService.makePopup({name:'End',state:'Philadelphia'}));

    if(this.zoom)
    {
      this.map.setView([45, -100], 4);
    }
    
    if(this.zoom)
    {
      var color = "#BC164D";
    }
    else
    {
      var color = "blue";
    }

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

      console.log("female IDs: ", femaleIDs);
      
      unionIDs = maleIDs.concat(femaleIDs);
      console.log("Union IDs: ", unionIDs);

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

    console.log("Union IDs: ", unionIDs);

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

    console.log("IDs to show: ", IDs);

    let viewComponent = this;

    this.map.removeLayer(this.markerClusters);

    this.markerClusters.eachLayer(function(layer) {
      let tempUserDataIndex = viewComponent.layerIDsToUserIndices[layer._leaflet_id.toString()];
      let tempUserData = viewComponent.userData[tempUserDataIndex];
      console.log("user data: ", viewComponent.userData);
      console.log("User data index: ", tempUserDataIndex);
      console.log("layerIDstouserindices: ", viewComponent.layerIDsToUserIndices);
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
    console.log("Creating org pins");

    //Clear all user and org pins
    this.clearUserPins();
    this.clearOrgPins();

    //Set max number of markers in a cluster and set up clustering
    var maxMarkersInCluster = 4;
    this.orgMarkerClusters = this.createMarkerClusterGroup(maxMarkersInCluster);

    //Iterate over user data, create and show pins and retain map of leaflet ID -> user idx
    for (var i = 0; i < this.orgData.length; i++){
      console.log("Creating pin with data ", this.orgData[i]);
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


  private initMap(): void {
    this.map = L.map('map', { zoomControl: false });

    // const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    //   maxZoom: 19,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });

    // tiles.addTo(this.map);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    new L.Control.Zoom({ position: "topright" }).addTo(this.map);

    //An extract of address points from the LINZ bulk extract: http://www.linz.govt.nz/survey-titles/landonline-data/landonline-bde
//Should be this data set: http://data.linz.govt.nz/#/layer/779-nz-street-address-electoral/
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
  description: string,
}

interface OrgPinData {
  org_pins: UserData[];
}
