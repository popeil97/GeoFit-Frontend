import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { PopUpService } from '../pop-up.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map;

  constructor(private popupService:PopUpService) { }

  ngAfterViewInit(): void {

    this.initMap();


    const lat = 29.651634;
    const lon = -82.324829;
    const marker = L.marker([lat, lon],{icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })}).addTo(this.map);


    marker.bindPopup(this.popupService.makePopup({name:'Alex',state:'FL'}));
    
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