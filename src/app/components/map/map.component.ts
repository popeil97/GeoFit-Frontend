import { AfterViewInit, Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChildren, QueryList, ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, RendererFactory2, ViewContainerRef, ApplicationRef } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { 
  UserProfileService,
  MapService,
  RaceService,
  PopUpService,
} from '../../services';
import {
  UserData,
  PinSettings,
  RoutePins,
  RouteData,
  OrgPinData,
} from '../../interfaces';
//import * as L from 'leaflet';
//import * as markercluster from 'leaflet.markercluster';
import { UserFollowComponent } from '../../user-follow/user-follow.component';
import { RoutePinDialogComponent } from '../../route-pin-dialog/route-pin-dialog.component';
import { MapRouteComponent } from '../map-route/map-route.component';

import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.heat';

const L = window['L'];
var heat = window['heat']

import * as _ from 'lodash';
import * as turf from '@turf/turf';
import { ListKeyManager } from '@angular/cdk/a11y';
import { AppComponent } from '../../app.component';
import { PopupComponent } from '../../popup/popup.component';
import { Route } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit,OnChanges {
  @ViewChildren(MapRouteComponent) mapRouteChildren: QueryList<MapRouteComponent>;

  @Input() useLoader:Boolean = true;
  @Input() draw:Boolean;
  @Input() displayUsers:Boolean;
  @Input() followedIDs:any;
  @Input() zoom:Boolean;

  //Parent race ID
  //Same as raceIDs elem if no child races
  @Input() parentRaceID:number;

  //IDs of races constituent to this race
  //More than one if this is a multi-route race
  @Input() raceIDs:number[] = [];

  //Route data to use in route components
  @Input() routeData = null;

  // onLatLngBoundsChange emits when a child map-route boundaries have changed
  // Note that the emitted LatLngBound does not represent the bounds for all child map routes,
  // just the route from which this event originates
  @Output() onLatLngBoundsChange: EventEmitter<L.LatLngBounds> = new EventEmitter();

  private orgData: UserData[];
  private userData: UserData[];
  private routePins: RoutePins[];

  //Leaflet map
  public map;

  //LatLng markers of all race start/end coords
  private raceMarkers = [] as any;

  private initialized: boolean = false;

  //Store user IDs of male and female pins
  private maleIDs: number[];
  private femaleIDs: number[];

  loading:boolean = false;

  constructor(
    private popupService:PopUpService, 
    private _profileService:UserProfileService,
    private _mapService: MapService,
    private _raceService:RaceService,
    public dialog: MatDialog
  ) {
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
              }
            case 'routeData':
              if (!this.routeData){
                this.getMapData();
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

    // If RouteData dict not provided, we create it given race_id input
    if (!this.routeData){
      this.getMapData();
    }

    this.initialized = true;
  }


  public getUserPinData(raceID:number,page:number) {
    return this._raceService.getUserRacestats(raceID,page).then((data:any) =>{
      this.routeData[raceID].userData = data.users_data;
      console.log("MAP USER DATA",data.users_data);
      this.loading = false;
    });
  }


  public getMapData(){
    this.loading=true;

    //To prevent old data from remaining on map if MapRouteComponent child
    //is deleted, pre-emptively clear pins
    _.forEach(this.mapRouteChildren.toArray(),(child:MapRouteComponent) => {
      child.clearUserPins();
      child.clearOrgPins();
    });

    //Pan to race start/end bounds
    this.panToRaceMarkerBounds();

    // Set up routeData dict
    if (!this.routeData){
      this.routeData = {};
    }

    for (let i = 0; i < this.raceIDs.length; i++) {
      let raceID = this.raceIDs[i];

      this.routeData[raceID] = (): RouteData => ({
        name: '',
        coords: [],
        route_pins: [],
        userData: [],
        org_pins: [],
        checkpoints: []
      });

      this._mapService.getOrgPinStats(raceID).then((data) => {
        let orgPinData = data as OrgPinData;
        this.routeData[raceID].org_pins = orgPinData.org_pins;
      });
      
      this._mapService.getMapData(raceID).then((data) => {
        let mapData = data as RouteData;
        console.log(mapData);

        this.routeData[raceID].coords = mapData.coords;
        this.routeData[raceID].route_pins = mapData.route_pins;

        let workers = [] as any;

        this._mapService.getUserPinSize(raceID).then((resp) => {
          let pages = resp['pages'];

          for(var page = 1; page <= pages; page++) {
            let worker = this.getUserPinData(raceID,page);
            workers.push(worker);
          }

        });

        this._mapService.getCheckpointMapData(raceID).then((resp) => {
          this.routeData[raceID].checkpoints = resp['checkpoints'];
        })

      });
    };
  }


  public panToRaceMarkerBounds(){
    if (this.parentRaceID){
      this._mapService.getRaceMarkers(this.parentRaceID).then((data) => {
        this.map.fitBounds(data['markers'], { padding: [20, 20] });
      })
    }
  }

  public panToMarkerBounds(markerBounds){
    var options = {'maxZoom': 15, 'animate': true, 'easeLinearity': 0.1}
    this.map.fitBounds(markerBounds, options);
  }

  // Bit of a cheat by peeking into the _layers attribute, but this is the easiest
  // way to completely clear the map
  public clearMap(){
    // Firstly we call each map route child's clearMap func
    _.forEach(this.mapRouteChildren.toArray(),(child:MapRouteComponent) => {
      child.clearMap();
    });
    // Then we clear up any remaining layers
    if (this.map){
      for(var i in this.map._layers) {
        if(this.map._layers[i]._path != undefined) {
            try {
                this.map.removeLayer(this.map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + this.map._layers[i]);
            }
        }
      }
    }
  }

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

  public onLatLngBoundsUpdate(bounds: L.LatLngBounds){
    this.onLatLngBoundsChange.emit(bounds);
  }


  private initMap(): void {
    this.map = L.map('map', { zoomControl: false });

    // const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    //   maxZoom: 19,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });

    // tiles.addTo(this.map);
    var map_tiles =  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const tiles = L.tileLayer(map_tiles, {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    new L.Control.Zoom({ position: "bottomright" }).addTo(this.map);

    //An extract of address points from the LINZ bulk extract: http://www.linz.govt.nz/survey-titles/landonline-data/landonline-bde
//Should be this data set: http://data.linz.govt.nz/#/layer/779-nz-street-address-electoral/
  }
  
  public panToUserMarker = (user_id:number):void => {
    console.log("Panning to user marker with ID of ", user_id);
    // Given a user_id, need to find which routeID they are on
    if (this.routeData == null) return;
    this.raceIDs.forEach(id => {
      let route = this.routeData[id];
      if (route != null && route.userData != null) {
        var foundUser = route.userData.filter((obj:UserData)=> {
          return obj.user_id === user_id
        });
        if (foundUser != null && foundUser.length == 1) {
          console.log('FOUND USER:',foundUser[0])
          let routeComp = this.mapRouteChildren.filter((mrc:MapRouteComponent)=>{
            return mrc.raceID == foundUser[0].race_id;
          });
          if (routeComp != null && routeComp.length > 0) {
            console.log('FOUND ROUTE COMP', routeComp[0]);
            routeComp[0].panToUserMarker(foundUser[0].user_id);
            return;
          }
        }
      }
    });
  }


}