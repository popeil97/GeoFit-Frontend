import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, RendererFactory2, ViewContainerRef, ApplicationRef } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { UserProfileService } from '../userprofile.service';
//import * as L from 'leaflet';
//import * as markercluster from 'leaflet.markercluster';
import { PopUpService } from '../pop-up.service';
import { UserFollowComponent } from '../user-follow/user-follow.component';

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
  @Input() followedIDs:any;
  @Input() zoom:Boolean;

  private map;
  private coordsRoute;
  private markersByUserID = {};
  private markerClusters:any;
  private layerIDsToUserIndices = {};
  private myMarker: any;
  private marker_start:any;
  private marker_end:any;
  private line:any;
  private myUserID:number;

  constructor(private popupService:PopUpService, 
              private _profileService:UserProfileService,) {
    Window["mapComponent"] = this;
  }

  ngOnChanges(changes: SimpleChanges) {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        switch(propName) {
          case 'coordinates':
            if(changes.coordinates.currentValue != undefined) {
              this.applyCoordinates();
              this.coordsRoute = turf.lineString(this.coordinates.coords, { name: "route" });
              
              if(this.displayUsers) {
                this.createUserPins(false);
              }

            }
        }
      }
    }

    console.log("USER DATA IN MAP COMPONENT");
    console.log(this.userData);
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

    //doing this temporarily because Lat/Lon are reversed smh
    var temp_coords = [];
    _.forEach(this.coordinates.coords,(coord) => {
      // let temp = coord[0];
      // coord[0] = coord[1];
      // coord[1] = temp;
      temp_coords.push([coord[1], coord[0]]);
    });

    let start_coord = temp_coords[0];
    let end_coord = temp_coords[temp_coords.length-1];

    let begin = new L.LatLng(start_coord[0], start_coord[1]);
    let finish = new L.LatLng(end_coord[0], end_coord[1]);
    let bounds = new L.LatLngBounds(begin, finish);

    this.map.fitBounds(bounds, { padding: [15, 15] });

    console.log("start coord: ", start_coord);

    const lat = 29.651634;
    const lon = -82.324829;
    this.marker_start = L.marker(start_coord,{icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [10, 40],
      popupAnchor: [18, -40],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    })}).addTo(this.map);

    this.marker_start.bindPopup(this.popupService.makePopup({name:'Start',state:'FL'}));

    this.marker_end = L.marker(end_coord,{icon: L.icon({
      iconSize: [ 38, 36 ],
      iconAnchor: [10, 40],
      popupAnchor: [18, -40],
      iconUrl: 'https://tucan-prod-bucket.s3-us-west-2.amazonaws.com/media/endflag.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    })}).addTo(this.map);

    this.marker_end.bindPopup(this.popupService.makePopup({name:'End',state:'FL'}));

    if(this.zoom)
    {
      this.map.setView([45, -100], 3);
    }
    
    if(this.zoom)
    {
      var color = "#BC164D";
    }
    else
    {
      var color = "blue";
    }
    this.line = L.polyline(temp_coords,{
      color: color,
      weight: 8,
      opacity: 0.65
    }).addTo(this.map);
  }

public clearUserPins(){
    //Remove all current user pins
    //Currently no working method to remove pins by ID
    //but this will be resolved perhaps with .forEach(layer)
    if (this.markerClusters){
      this.map.removeLayer(this.markerClusters);
    }
  }

  public showPinsByID(IDs){
    /////////METHOD NOT WORKING//////////

    //Clear all pins
    this.clearUserPins();

    //Add user markers based on IDs argument
    //If IDs null, add all users
    for (var id in this.markersByUserID){
      if (IDs == null || IDs.includes(parseInt(id))){
        this.markersByUserID[id]['locMarker'].addTo(this.map);
      }
      else {
        this.markersByUserID[id]['locMarker'].remove();
        //If this doesn't work, try
        //this.map.removeLayer(this.markersByUserID[id]['locMarker']);
      }
    }
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

      var user_ran_miles = this.userData[i].total_distance;

      var along_user = turf.along(this.coordsRoute, user_ran_miles, {units: 'miles'});

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
      let elementID = this.userData[i].user_id

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
      if (this.userData[i].isMe){
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
      console.log("CREATING HEAT MAP PINS")
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
      console.log("CREATING NON HEAT MAP PINS")
    }

  }

  private initMap(): void {
    this.map = L.map('map', { zoomControl: false });

    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    new L.Control.Zoom({ position: "topright" }).addTo(this.map);

    //An extract of address points from the LINZ bulk extract: http://www.linz.govt.nz/survey-titles/landonline-data/landonline-bde
//Should be this data set: http://data.linz.govt.nz/#/layer/779-nz-street-address-electoral/

    
  }


}