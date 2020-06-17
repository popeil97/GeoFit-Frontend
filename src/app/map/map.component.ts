import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { PopUpService } from '../pop-up.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @Input() coordinates;
  @Input() draw:Boolean;
  @Input() displayUsers:Boolean;
  @Input() userData;

  private map;

  constructor(private popupService:PopUpService) { }

  ngAfterViewInit(): void {

    
    

    this.initMap();

    if(!this.coordinates) {
      return;
    }

    console.log('GOT COORDINATES:',this.coordinates.coords);

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