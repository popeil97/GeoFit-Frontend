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
  private route;
  private markersByUserID = {};

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
              this.route = turf.lineString(this.coordinates.coords, { name: "route" });
            }
            
          case 'userData':
            if(changes.userData.currentValue != undefined) {
              this.plotUserPins();
            }
        }
      }
    }
    
    console.log("USER DATA IN MAP COMPONENT");
    console.log(this.userData);
  }


  ngAfterViewInit(): void {
    this.initMap();
  }

  private applyCoordinates():void {

    console.log('GOT COORDINATES:',this.coordinates.coords);
    console.log('MAP:',this.map);

    // doing this temporarily because Lat/Lon are reversed smh
    _.forEach(this.coordinates.coords,(coord) => {
      let temp = coord[0];
      coord[0] = coord[1];
      coord[1] = temp;
    });

    let start_coord = this.coordinates.coords[0];
    let end_coord = this.coordinates.coords[this.coordinates.coords.length-1];

    const lat = 29.651634;
    const lon = -82.324829;
    const marker_start = L.marker(start_coord,{icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [10, 40],
      popupAnchor: [18, -40],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })}).addTo(this.map);

    marker_start.bindPopup(this.popupService.makePopup({name:'Start',state:'FL'}));

    const marker_end = L.marker(end_coord,{icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [10, 40],
      popupAnchor: [18, -40],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })}).addTo(this.map);

    marker_end.bindPopup(this.popupService.makePopup({name:'End',state:'FL'}));

    const line = L.polyline(this.coordinates.coords,{
      color: "Blue",
      weight: 8,
      opacity: 0.65
    }).addTo(this.map);
  }

  private plotUserPins(){
    
    // doing this temporarily because Lat/Lon are reversed smh
    _.forEach(this.coordinates.coords,(coord) => {
      let temp = coord[0];
      coord[0] = coord[1];
      coord[1] = temp;
    });
    
    for (var i = 0; i < this.userData.length; i++){
      var img_html = "<img src=\"" + this.userData[i].profile_url + "\";\"><div class=\"pin\"></div><div class=\"pulse\"></div>";
        //var img_html = "<img src=\"" + all_user_stats[i].user_profile_url + "\"><div class=\"pin\"></div><div class=\"pulse\"></div>";

      var userIcon = L.divIcon({
        className: 'location-pin',
        html: img_html,
        iconSize: [30, 30],
        iconAnchor: [10, 33],
        popupAnchor: [0, -62],
      });

      var user_ran_miles = this.userData[i].total_distance;
      console.log("user ran miles: ", user_ran_miles);

      var along_user = turf.along(this.route, user_ran_miles, {units: 'miles'});

      var lng_user = along_user.geometry.coordinates[0];
      var lat_user = along_user.geometry.coordinates[1];

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
      if (userStoryImg != '' || userStoryCaption != ''){
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