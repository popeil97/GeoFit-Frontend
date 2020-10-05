import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges, ViewChildren, QueryList, ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, RendererFactory2, ViewContainerRef, ApplicationRef } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { UserProfileService } from '../userprofile.service';
//import * as L from 'leaflet';
//import * as markercluster from 'leaflet.markercluster';
import { PopUpService } from '../pop-up.service';
import { UserFollowComponent } from '../user-follow/user-follow.component';
import { RoutePinDialogComponent } from '../route-pin-dialog/route-pin-dialog.component';
import { MapService } from '../map.service';
import { MapRouteComponent } from '../map-route/map-route.component';

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
import { Route } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit,OnChanges {
  @ViewChildren(MapRouteComponent) mapRouteChildren: QueryList<MapRouteComponent>;

  @Input() coordinates;
  @Input() draw:Boolean;
  @Input() displayUsers:Boolean;
  @Input() followedIDs:any;
  @Input() zoom:Boolean;

  //IDs of races constituent to this race
  //More than one if this is a multi-route race
  @Input() raceIDs:number[] = [];

  private orgData: UserData[];
  private userData: UserData[];
  private routePins: RoutePins[];

  //Route data to use in route components
  public routeData = {};

  //Leaflet map
  public map;

  private initialized: boolean = false;

  //Store user IDs of male and female pins
  private maleIDs: number[];
  private femaleIDs: number[];

  loading:boolean = false;

  constructor(private popupService:PopUpService, 
              private _profileService:UserProfileService,
              private _mapService: MapService,
              private _raceService:RaceService,
              public dialog: MatDialog) {
    Window["mapComponent"] = this;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized){
      for(const propName in changes) {
        if(changes.hasOwnProperty(propName)) {
          switch(propName) {
            case 'raceIDs':
              if (!_.isEqual(changes.raceIDs.currentValue, changes.raceIDs.previousValue)){
                this.getMapData();
                console.log("map:race-id", this.raceIDs);
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

    //This ensures we can still use homepage coords if provided via Input
    if (!this.coordinates){
      this.getMapData();
    }

    this.initialized = true;
  }

  public getUserPinData(raceID:number,page:number) {
    //console.log('getting user data')
    return this._raceService.getUserRacestats(raceID,page).then((data:any) =>{
      this.routeData[raceID].userData = data.users_data;

      this.loading = false;
    });
  }


  public getMapData(){
    this.loading=true;

  //   this.userData = [];
  //   let workers = [] as any;

  //   this._mapService.getUserPinSize(this.raceID).then((resp) => {
  //     console.log('USER PIN SIZE RESP:',resp);
  //     let pages = resp['pages'];

  //     for(var page = 1; page <= pages; page++) {
  //       let worker = this.getUserPinData(page);
  //       workers.push(worker);
  //     }

  //     console.log('WORKERS:',workers)

  //     // Promise.all(workers).then((vals:any) => {
  //     //   console.log('DONE LOADING PINS:',vals)
  //     //   vals.forEach((val) => {
  //     //     this.userData = this.userData.concat(val['users_data']);
  //     //   });

  //     //   console.log('ALL USERS DATA:',this.userData)

  //     //   if (this.displayUsers){
  //     //     this.createUserPins(false);
  //     //   }
  //     //   this.loading = false;
  //     // })
  //   });

    

  //   this._mapService.getOrgPinStats(this.raceID).then((data) => {
  //     console.log('ORG PINSSSS DATAAAAA',data);
  //     let orgPinData = data as OrgPinData;
  //     this.orgData = orgPinData.org_pins;
  //   })
    
  //   this._mapService.getMapData(this.raceID).then((data) => {
  //     let mapData = data as MapData;

  //     //Get and apply coordinates
  //     this.coordinates = mapData.coords;
  //     this.applyCoordinates();

  //     //Get and apply route pins
  //     this.routePins = mapData.route_pins;
      

  //     this.loading=true;

      
  //   });

  // }

  // public getUserPinData(page:number) {
  //   console.log('getting user data')
  //   return this._raceService.getUserRacestats(this.raceID,page).then((data) =>{
  //     this.userData = this.userData.concat(data['users_data']);

  //     if (this.displayUsers){
  //       this.createUserPins(false);
  //     }
  //     this.loading = false;
  //   });
  // }

    //To prevent old data from remaining on map if MapRouteComponent child
    //is deleted, pre-emptively clear pins
    _.forEach(this.mapRouteChildren.toArray(),(child:MapRouteComponent) => {
      child.clearUserPins();
      child.clearOrgPins();
    });

    //console.log("Race IDs in map comp: ", this.raceIDs);

    for (let i = 0; i < this.raceIDs.length; i++) {
      let raceID = this.raceIDs[i];
    //  //console.log(raceID);

      this.routeData[raceID] = (): RouteData => ({
        name: '',
        coords: [],
        route_pins: [],
        userData: [],
        org_pins: [],
      });

      this._mapService.getOrgPinStats(raceID).then((data) => {
        let orgPinData = data as OrgPinData;
        this.routeData[raceID].org_pins = orgPinData.org_pins;
      });
      
      this._mapService.getMapData(raceID).then((data) => {
        //console.log(data);
        let mapData = data as RouteData;

        this.routeData[raceID].coords = mapData.coords;
        this.routeData[raceID].route_pins = mapData.route_pins;
          
        // this._raceService.getUserRacestats(raceID).then((data:any) => {
        //   this.routeData[raceID].userData = data.users_data;
        //   //console.log("User pin data: ", this.routeData[raceID].userData)
          
        //   this.loading=false;
        // });

      let workers = [] as any;

      this._mapService.getUserPinSize(raceID).then((resp) => {
        //console.log('USER PIN SIZE RESP:',resp);
        let pages = resp['pages'];

        for(var page = 1; page <= pages; page++) {
          let worker = this.getUserPinData(raceID,page);
          workers.push(worker);
        }

        //console.log('WORKERS:',workers)

      });



        
      });
    };

  }

  public panToMarkerBounds(markerBounds){
    console.log("PPAN1")
    var options = {'maxZoom': 15, 'animate': true, 'easeLinearity': 0.1}
    this.map.fitBounds(markerBounds, options);
  }


  // public panToUserMarker(user_id, showPopUp=true){
  //   //Do this to simply pan to user pin
  //   //this.map.panTo(this.markersByUserID[user_id.toString()]['latLng']);

  //   //Do this to pan *and* zoom
  //   var markerBounds = L.latLngBounds([this.markersByUserID[user_id.toString()]['latLng']]);
  //   var options = {'maxZoom': 15, 'animate': true, 'easeLinearity': 0.1}
  //   this.map.fitBounds(markerBounds, options);
  // }


  // public panToUSA(){
  //   var corner1 = L.latLng(40.4, -73.7);
  //   var corner2 = L.latLng(39.79, -75.5);
  //   var markerBounds = L.latLngBounds(corner1,corner2);
  //   var options = {'maxZoom': 15, 'animate': true, 'easeLinearity': 0.1}
  //   this.map.fitBounds(markerBounds, options);
  // }


  // public panToIsrael(){
  //   var corner1 = L.latLng(31.8,35.3);
  //   var corner2 = L.latLng(31.76, 35.18);
    
  //   var markerBounds = L.latLngBounds(corner1,corner2);
  //   var options = {'maxZoom': 15, 'animate': true, 'easeLinearity': 0.1}
  //   this.map.fitBounds(markerBounds, options);
  // }


  // public clearMap(): void {
  //   if(this.marker_start && this.marker_end && this.line) {
  //     this.map.removeLayer(this.marker_start);
  //     this.map.removeLayer(this.marker_end);
  //     this.map.removeLayer(this.line);
  //   }
  // }


  public showPinsFromSettings(settings: PinSettings){
    //for each map-route child, call their showPinsFromSettings func
    _.forEach(this.mapRouteChildren.toArray(),(child:MapRouteComponent) => {
      child.showPinsFromSettings(settings);
    });
  }

  public showAllPins(){
    //for each map-route child, call their showAllPins func
    _.forEach(this.mapRouteChildren.toArray(),(child:MapRouteComponent) => {
      child.showAllPins();
    });
  }

  public clearUserPins(){
    //for each map-route child, call their clearUserPins func
    _.forEach(this.mapRouteChildren.toArray(),(child:MapRouteComponent) => {
      child.clearUserPins();
    });
  }

  
  public clearOrgPins(){
    //for each map-route child, call their clearOrgPins func
    _.forEach(this.mapRouteChildren.toArray(),(child:MapRouteComponent) => {
      child.clearOrgPins();
    });
  }


  //Updates the logged in users stat and recreates *all* pins
  public updateMyUserStatAndCreatePins(raceID: number){
    //call this func for map-route child of route user is importing activs to!
    _.forEach(this.mapRouteChildren.toArray(),(child:MapRouteComponent) => {
      if (child.raceID == raceID){
        child.updateMyUserStatAndCreatePins();
      }
    });
  }


  private initMap(): void {
    this.map = L.map('map', { zoomControl: false });

    // const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    //   maxZoom: 19,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });

    // tiles.addTo(this.map);

    const tiles = L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
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

interface RouteData {
  name: string;
  coords: any;
  route_pins: RoutePins[];
  userData: UserData[];
  org_pins: UserData[];
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
