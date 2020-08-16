import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, RendererFactory2, ViewContainerRef, ApplicationRef } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { UserProfileService } from '../userprofile.service';
//import * as L from 'leaflet';
//import * as markercluster from 'leaflet.markercluster';
import { PopUpService } from '../pop-up.service';
import { UserFollowComponent } from '../user-follow/user-follow.component';
import { RoutePinDialogComponent } from '../route-pin-dialog/route-pin-dialog.component';

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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit,OnChanges {
  @Input() coordinates;
  @Input() draw:Boolean;
  @Input() displayUsers:Boolean;
  @Input() userData:any;
  @Input() routePins:RoutePins[];
  @Input() followedIDs:any;
  @Input() zoom:Boolean;

  public map;
  private coordsRoutes:any[];
  private markersByUserID = {};
  private markerClusters:any;
  private routePinMarkers:any;
  private layerIDsToUserIndices = {};
  private myMarker: any;
  private marker_start:any;
  private marker_end:any;
  private line:any;
  private myUserID:number;

  //Store user IDs of male and female pins
  private maleIDs: number[];
  private femaleIDs: number[];

  //We extend the Marker class to set our own 'routePinIndex' option
  private routePinMarker = L.Marker.extend({
    options: {
      routePinIndex: 0,
    }
  });

  constructor(private popupService:PopUpService, 
              private _profileService:UserProfileService,
              public dialog: MatDialog) {
    this.coordsRoutes = [];
    Window["mapComponent"] = this;

    
  }

  ngOnChanges(changes: SimpleChanges) {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        switch(propName) {
          case 'coordinates':
            if(changes.coordinates.currentValue != undefined) {
              this.applyCoordinates();
              
              if(this.displayUsers) {
                this.createUserPins(false);
              }

              if(this.routePins){
                this.createRoutePins();
              }

            }
        }
      }
    }

  }

  ngAfterViewInit(): void {
    if(this.map == undefined) {
      this.initMap();
    }
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
    if (settings.allAgesOn && settings.malePinsOn && settings.femalePinsOn && !settings.followerPinsOnly){
      //this.showAllPins();

      //Temp fix to clustering not working after pin filtering
      //Just redo the whole pin creation process
      this.createUserPins(false);
      return;
    }
    
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
      
      unionIDs = maleIDs.concat(femaleIDs);
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

  public showPinsByID(IDs, showAll: boolean){
    //Clear all pins
    this.clearUserPins();

    let viewComponent = this;

    this.map.removeLayer(this.markerClusters);

    this.markerClusters.eachLayer(function(layer) {
      let tempUserDataIndex = viewComponent.layerIDsToUserIndices[layer._leaflet_id.toString()];
      let tempUserData = viewComponent.userData[tempUserDataIndex];
      let pinUserID = tempUserData.user_id;

      if (showAll == true || IDs.includes(parseInt(pinUserID))){
        layer.addTo(viewComponent.map);
      }
      else {
        layer.remove();
      }
    });
  }

  public createUserPins(heatMapOn){
    //Clear all user pins
    this.clearUserPins();

    //Set max number of markers in a cluster
    var maxMarkersInCluster = 4;

    this.markerClusters = L.markerClusterGroup({
      //disableClusteringAtZoom: 12, //12
      maxClusterRadius: 20, //20
      animateAddingMarkers: true,
      iconCreateFunction: function(cluster){
          var markers = cluster.getAllChildMarkers();

          //Maximum of 4 imgs per cluster (choose first 4 children)
          var markersInCluster = Math.min(maxMarkersInCluster, markers.length);

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

    var heatArray = new Array(this.userData.length);

    for (var i = 0; i < this.userData.length; i++){
      var img_html = "<img src=\"" + this.userData[i].profile_url + "\";\"><div class=\"pin\"></div><div class=\"pulse\"></div>";

      var userIcon = L.divIcon({
        className: 'location-pin',
        html: img_html,
        iconSize: [30, 30],
        iconAnchor: [10, 33],
        popupAnchor: [0, -62],
      });

      var user_rel_miles = parseFloat(this.userData[i].rel_distance);
      var user_route_idx = this.userData[i].route_idx;

      //Get user's distance type for turf
      var distanceTypeOptions;
      if (this.userData[i].distance_type == 'MI'){
        distanceTypeOptions = {units: 'miles'};
      }
      else {
        distanceTypeOptions = {units: 'kilometers'};
      }

      var along_user = turf.along(this.coordsRoutes[user_route_idx], user_rel_miles, distanceTypeOptions);

      var lng_user = along_user.geometry.coordinates[0];
      var lat_user = along_user.geometry.coordinates[1];

      heatArray[i] = [lat_user,lng_user,1]
      heatArray[i+this.userData.length] = [lat_user,lng_user,1.0]

      var locMarker = L.geoJSON(along_user, {
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, { icon: userIcon });
        }
      })

      //Get user ID of this race stat
      let elementID = this.userData[i].user_id;

      this.markerClusters.addLayer(locMarker);

      //Update mapping of leaflet marker IDs to index in userData
      let user_leaflet_id = Object.keys(locMarker._layers)[0].toString()
      this.layerIDsToUserIndices[user_leaflet_id] = i;

      //Retain markers in dict so we can pan to it upon select
      this.markersByUserID[elementID] = {
          'locMarker' : locMarker,
          'latLng' : L.latLng(lat_user, lng_user),
      };

      //If this pin is current user, pan and zoom to it
      if (this.isMe(this.userData[i])){
        this.myMarker = this.markersByUserID[elementID]['locMarker'];
        this.panToUserMarker(elementID);
        this.myUserID = elementID;
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


    heatArray = heatArray.map(function (p) { return [p[0], p[1]]; });

    if(heatMapOn)
    {
      try{
        heat.remove();
      }
      catch(ex){}
      
      heat = L.heatLayer(heatArray, {radius: 50},{minOpacity: 1.0}).addTo(this.map);
    }
    else
    {
      try{
        heat.remove();
      }
      catch(ex){}
    }

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
    console.log("In dialogue function");
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
      console.log("Thanks for clicking on marker ", ev.layer.options.routePinIndex);
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
}

interface RoutePins {
  title: string;
  desciption: string;
  lon: number;
  lat: number;
  image_urls: string[];
}