import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { CoordinatesService } from '../coordinates.service';
import { MapComponent } from '../map/map.component';
import { RaceService } from '../race.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-race-create',
  templateUrl: './race-create.component.html',
  styleUrls: ['./race-create.component.css']
})
export class RaceCreateComponent implements OnInit {

  @ViewChild(MapComponent) map:MapComponent;

  raceForm:FormGroup;
  options:any[];
  coords:any;
  startOptions:MapBoxPlace[];
  endOptions:MapBoxPlace[];
  isPreviewMode:Boolean= false;
  loading:Boolean = false;
  previewDistance:string;
  uploadeUrl:any;

  selectedStartLoc:MapBoxPlace;
  selectedEndLoc:MapBoxPlace;

  constructor(private _coordinateService:CoordinatesService, private _raceService:RaceService, private router:Router) { 
    this.raceForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      startDate: new FormControl('',[
        Validators.required
      ]),
      endDate: new FormControl('',[
        Validators.required
      ]),
      startLoc: new FormControl('',[
        Validators.required
      ]),
      endLoc: new FormControl('', [
        Validators.required
      ]),
      public: new FormControl(false,[
        Validators.required
      ]),
      routeFile: new FormControl('')
    });

    this.options = [
      {
        name: 'Ocala, FL'
      },
      {
        name: 'Gainesville, FL'
      }
    ];

  }

  ngOnInit() {
  }

  locationFilter(key:string) {
    let query:string = this.raceForm.value[key];
    console.log('QUERY:',query);

    this._coordinateService.getLocation(query).then((resp:MapBoxPlaceResp) => {
      console.log('LOCATION RESP:',resp);

      if(key == 'startLoc') {
        this.selectedStartLoc = null;
        this.startOptions = resp.features;
      }

      else {
        this.selectedEndLoc = null;
        this.endOptions = resp.features;
      }
    })
  }

  selectOption(option:any, key:string) {
    console.log('TEST:',option);
    if(key == 'startLoc') {
      this.selectedStartLoc = option;
    }

    else {
      this.selectedEndLoc = option;
    }
  }

  clearForm() {
    this.selectedEndLoc = null;
    this.selectedStartLoc = null;
    this.raceForm.reset();
  }

  submitRaceForm() {
    let formClean = this.raceForm.value as RaceForm;
    console.log(this.raceForm);
    let isValid: Boolean = this.raceForm.valid;

    if(isValid) {

      formClean.start_lon = this.selectedStartLoc.center[0];
      formClean.start_lat = this.selectedStartLoc.center[1];

      formClean.end_lon = this.selectedEndLoc.center[0];
      formClean.end_lat = this.selectedEndLoc.center[1];

      formClean.routeFile = this.uploadeUrl;

      this._raceService.createRace(formClean).then((resp:FromResp) => {
        console.log('CREATE RESP:',resp)

        this.router.navigate(['/about',{name:resp.name,id:resp.race_id}]);
      });

      this.raceForm.reset();
    }
  }

  preview() {
    
    if(this.selectedStartLoc != null && this.selectedEndLoc != null) {
      this.loading=true;
      let start_coord:MapBoxCoord = this.selectedStartLoc.center;
      let end_coord:MapBoxCoord = this.selectedEndLoc.center;

      start_coord.lon = this.selectedStartLoc.center[0];
      start_coord.lat = this.selectedStartLoc.center[1];

      end_coord.lon = this.selectedEndLoc.center[0];
      end_coord.lat = this.selectedEndLoc.center[1];

      console.log(start_coord);
      console.log(end_coord);

      this._coordinateService.getCoordinates(start_coord,end_coord).then((resp:GraphHopperResp) => {
        console.log('RESP:',resp);
        this.map.clearMap();
        this.coords = resp.coords;
        this.isPreviewMode = true;
        this.previewDistance = resp.distance.toString() + resp.dist_unit
        this.loading=false;
      })
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      let file = event.target.files[0];

      console.log('FILE:',file);

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadeUrl = file;
      }
    }
  }
}

interface MapBoxPlaceResp {
  features: any[];
}

interface MapBoxPlace {
  center:any;
  place_name:string;
}

export interface MapBoxCoord {
  lon:number;
  lat:number;
}

interface GraphHopperResp {
  coords:any[];
  distance:number;
  dist_unit:string;
}

interface RaceForm {
  start_lon:number;
  start_lat:number;
  end_lon:number;
  end_lat:number;
  valid:Boolean;
  name:string,
  startDate:string;
  endDate:string;
  startLoc:string;
  endLoc:string;
  public:Boolean;
  routeFile:any;
}

interface FromResp {
  race_id:number;
  name:string;
}