import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { PopUpService } from '../pop-up.service';
import * as _ from 'lodash';
import * as turf from '@turf/turf';

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

  private map;
  private coordsRoute;
  private markersByUserID = {};
  private marker_start:any;
  private marker_end:any;
  private line:any;

  constructor(private popupService:PopUpService) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:',changes);

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'coordinates':
            console.log('COORDS CHANGED');
            if(changes.coordinates.currentValue != undefined) {
              this.applyCoordinates();
              this.coordsRoute = turf.lineString(this.coordinates.coords, { name: "route" });
              if(this.displayUsers) {
                this.plotUserPins();
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

  public panToUserMarker(user_id){
    console.log("Clicked user id: ", user_id);

    this.markersByUserID[user_id.toString()]['locMarker'].openPopup();

    //Do this to simply pan to user pin
    this.map.panTo(this.markersByUserID[user_id.toString()]['latLng']);

    //Do this to pan *and* zoom
    //var markerBounds = L.latLngBounds([markersByUserID[user_id.toString()]['latLng']]);
    //var options = {'animate': true, 'easeLinearity': 0.1}
    //mymap.fitBounds(markerBounds, options);
  }

  public clearMap(): void {
    if(this.marker_start && this.marker_end && this.line) {
      this.map.removeLayer(this.marker_start);
      this.map.removeLayer(this.marker_end);
      this.map.removeLayer(this.line);
    }
  }

  private applyCoordinates():void {

    console.log('GOT COORDINATES:',this.coordinates.coords);
    console.log('MAP:',this.map);
    
    

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

    // let start_coord = this.coordinates.coords[0];
    // let end_coord = this.coordinates.coords[this.coordinates.coords.length-1];
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
      shadowUrl: 'leaflet/marker-shadow.png'
    })}).addTo(this.map);

    this.marker_start.bindPopup(this.popupService.makePopup({name:'Start',state:'FL'}));

    this.marker_end = L.marker(end_coord,{icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [10, 40],
      popupAnchor: [18, -40],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })}).addTo(this.map);

    this.marker_end.bindPopup(this.popupService.makePopup({name:'End',state:'FL'}));

    this.line = L.polyline(temp_coords,{
      color: "Blue",
      weight: 8,
      opacity: 0.65
    }).addTo(this.map);
  }

  private plotUserPins(){

    //Remove all current user pins
    for (var id in this.markersByUserID){
      this.markersByUserID[id]['locMarker'].remove();
    }
    this.markersByUserID = {};
    
    // doing this temporarily because Lat/Lon are reversed smh
    // _.forEach(this.coordinates.coords,(coord) => {
    //   let temp = coord[0];
    //   coord[0] = coord[1];
    //   coord[1] = temp;
    // });

    console.log("coords in plot: ", this.coordinates.coords);

    console.log("this user_data: ", this.userData);
    
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
      console.log("user ran miles: ", user_ran_miles);

      var along_user = turf.along(this.coordsRoute, user_ran_miles, {units: 'miles'});
      console.log("along user: ", along_user);

      var lng_user = along_user.geometry.coordinates[0];
      var lat_user = along_user.geometry.coordinates[1];

      console.log("lnglat")
      console.log(lng_user);
      console.log(lat_user);

      var locMarker = L.geoJSON(along_user, {
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, { icon: userIcon });
        }
      })
        .addTo(this.map)

      console.log("added loc marker!");

      //Create template popup text
      var popupText = "<center>" +
                      this.userData[i].display_name +
                      "</center>" +
                      "<center>" +
                      user_ran_miles +
                      " " +
                      'miles' +
                      "</center>";

      /*
      //Display projected info if we are user
      if (this.userData[i].user_id == my_user_id){
        popupText +=
          "<center>" +
          "You are in " +
          "<b>" +
          locPart1 +
          ", " +
          state +
          "</b>" +
          "</center>";

          //Only show times to goal if not null
          if (ttg != null){
              popupText +=
                  "<center>" +
                  "You are expected to arrive in " +
                  race_end +
                  " on " +
                  "<b>" +
                  ttg +
                  "</b>" +
                  "</center>";
          }
          popupText +=
          "<center>" +
          "You are averaging " +
          "<b>" +
          mpd +
          "</b>" +
          " " +
          distanceUnitsStr +
          " per day" +
          "</center>";
      }
      */
      //Get story image and caption
      var userStoryImg = this.userData[i].story_image;
      var userStoryCaption = this.userData[i].story_text;

      //Add story info to marker popup
      if (userStoryImg || userStoryCaption){
          popupText += "<center>" +
                  "<a data-toggle=\"modal\" data-target=\"#storyModal\" data-userstatindex=\"" +
                  i +
                  "\">" +
                  "<br><img src=\"" +
                  userStoryImg +
                  "\" style=\"max-width:150px;\"></a>" +
                  "</center>" +
                  "<center>" +
                  userStoryCaption +
                  "</center>";
      }

      /*
      //Add text to popup, open if we are user
      if (all_user_stats[i].user_id == my_user_id){
        locMarker.bindPopup(popupText, {maxWidth: 200}).openPopup();
      }
      else{
        locMarker.bindPopup(popupText, {maxWidth: 200});
      }
      */

      //Temp before we retrieve logged in user's ID
      locMarker.bindPopup(popupText, {maxWidth: 200});

      //Retain markers in dict so we can pan to it upon select
      console.log(this.markersByUserID);
      console.log("this user's id: ", this.userData[i].user);
      this.markersByUserID[this.userData[i].user_id.toString()] = {
          'locMarker' : locMarker,
          'latLng' : L.latLng(lat_user, lng_user)};
      }
      
    }


  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  
}