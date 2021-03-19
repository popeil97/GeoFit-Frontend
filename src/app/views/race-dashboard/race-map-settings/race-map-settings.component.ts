import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';

import { CoordinatesService } from '../../../coordinates.service';
import { RaceService} from '../../../race.service';
import { cannotBeEmptyString, isNumber, notSameStartEndLocations, isFormValid } from '../../../services'

import { MapComponent, RouteData } from '../../../map/map.component';

@Component({
  selector: 'app-race-map-settings',
  templateUrl: './race-map-settings.component.html',
  styleUrls: [
    './race-map-settings.component.css',
    '../../../../styles/forms.css'
  ]
})
export class RaceMapSettingsComponent implements OnInit,AfterViewInit {
  @ViewChild(MapComponent) previewMap:MapComponent;

  @Input() raceID:number = null;
  @Input() raceData:any = null;
  @Input() getRaceDataCallback: (callback:any) => void;

  public loading:Boolean = true;
  public checkingValidityOfSubmission:Boolean = false;
  public hasSubmitted:Boolean = false;
  public validForm:Boolean = false;

  public form:FormGroup = null;
  private originalKeyDict = {
    'startLoc':'start_loc',
    'startLat':'start_lat',
    'startLon':'start_lon',
    'endLoc':'end_loc',
    'endLat':'end_lat',
    'endLon':'end_lon',
    'mapFile':'routeFile',
  }
  public changedValues : Array<string> = [];
  public locationOptions = {
    startLoc:null,
    endLoc:null,
  }
  public generatingRoute = false;
  public generateError:string = null;

  public mapFileInput:any;
  public mapFile = {
    data:null,
    filename:"",
  }
  public mapFileLoading:Boolean = false;
  public coords:any = null;

  // routeData stores key-value pairs where keys are race IDs and values
  // implement RouteData interface. We only set this to preview the uploaded
  // coordinates before the user saves them to the race
  public routeData = null;

  public distanceType:string = "Miles";

  public previewLoading:Boolean = false;

  constructor(
    private _coordinateService:CoordinatesService,
    private _raceService:RaceService,
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit() {
    this.mapFileInput = document.getElementById('MapFileUpload');
    console.log(this.routeData);
  }

  // resetRouteDataFromCoords resets the preview map to show the existing route
  resetRouteDataFromCoords(){
    this.resetForm();
    this.previewMap.clearMap();
    this.routeData = null;
    console.log(this.routeData);
  }

  // setRouteDataFromCoords sets the preview map to show the uploaded route. This
  // route has not been saved yet
  setRouteDataFromCoords(coords:any[]) {
    this.routeData = {};
    this.routeData[this.raceID] = (): RouteData => ({
      name: '',
      coords: [],
      route_pins: [],
      userData: [],
      org_pins: [],
      checkpoints: []
    });

    console.log("Uploaded data: ", coords);
    this.previewMap.clearMap();
    this.routeData[this.raceID].coords = coords;
    console.log(this.routeData);
  }

  // --- RACE FORM FUNCTIONS ---
  initializeForm() {
    this.loading = true;
    this.hasSubmitted = false;
    this.checkingValidityOfSubmission = false;
    this.validForm = true;

    this.mapFileLoading = false;
    this.mapFile = {
      data:null,
      filename:"",
    }

    this.generatingRoute = false;
    this.generateError = null;

    //console.log(this.raceData);


    this.form = new FormGroup({  
      startLoc:new FormControl(this.raceData.start_loc,[
        Validators.required,
        cannotBeEmptyString(),
      ]),
      startLat:new FormControl(this.raceData.start_lat,[
        Validators.required,
        isNumber(),
        cannotBeEmptyString(),
      ]),
      startLon:new FormControl(this.raceData.start_lon,[
        Validators.required,
        isNumber(),
        cannotBeEmptyString(),
      ]),
      endLoc:new FormControl(this.raceData.end_loc,[
        Validators.required,
        cannotBeEmptyString(),
      ]),
      endLat:new FormControl(this.raceData.end_lat,[
        Validators.required,
        isNumber(),
        cannotBeEmptyString(),
      ]),
      endLon:new FormControl(this.raceData.end_lon,[
        Validators.required,
        isNumber(),
        cannotBeEmptyString(),
      ]),
      mapFile:new FormControl(null),
    },
      notSameStartEndLocations,
    );
    this.loading = false;
  }
  valueChange(key:string) {

    const removeFromChanged = (k:string) => {
      const index = this.changedValues.indexOf(k);
      if (index > -1) this.changedValues.splice(index,1);
      //console.log(this.changedValues);
    }
    const addToChanged = (k:string) => {
      const index = this.changedValues.indexOf(k);
      if (index == -1) this.changedValues.push(k);
      //console.log(this.changedValues);
    }

    const originalKey = this.originalKeyDict[key];
    if (originalKey == null) {
      console.error(`No corresponding original key with ${key}`);
      return;
    }
    else if (originalKey == "routeFile") {
      // Either the map file was generated (aka this.mapFile or form.get(mapFile).value)
      // We normally will just add the change to the set of changedValues anyways
      addToChanged(key);
      return;
    }

    var input = this.form.get(key);
    if (input.errors != null || input.value === this.raceData[originalKey]) {
      removeFromChanged(key);
      return;
    }
    addToChanged(key);
  }
  hasErrors(key:string, errorKeys:Array<string>):Boolean {
    const input = this.form.get(key);
    if (!input) return false;
    return errorKeys.reduce((accumulator,index)=>{
      return accumulator || input.hasError(index);
    },false);
  }
  formValid = () => {
    return isFormValid(this.form);
  }
  resetForm() {
    this.initializeForm();
  }
  onFormSubmit() {
    this.checkingValidityOfSubmission = true;
    this.hasSubmitted = true;
    this.validForm = this.formValid();
    //console.log(this.changedValues, this.validForm);

    if (this.validForm && this.changedValues.length > 0) {
      let formClean = this.changedValues.reduce((accumulator,key)=>{
        const originalKey = this.originalKeyDict[key];
        if (originalKey) {
          if (originalKey == "routeFile") {
            accumulator[originalKey] = this.mapFile.data;
          } else {
            accumulator[originalKey] = this.form.get(key).value;
          }
        }
        return accumulator;
      },{});
      //console.log(formClean);
      if (Object.keys(formClean).length == 0) {
        this.checkingValidityOfSubmission = false;
        return;
      }
      formClean['race_id'] = this.raceID;
      this._raceService.updateMapRoute(formClean).then(resp=>{
        console.log('RESP:',resp);
        this.getRaceDataCallback(()=>{
          alert("Your race map has been successfully updated.");
          this.initializeForm();
        });
      }).catch(error => {
        alert("Error in map update!");
        console.log(error);
      }).finally(()=>{
        this.checkingValidityOfSubmission = false;
      });
    } else {
      this.checkingValidityOfSubmission = false;
    }
    // 
  }
  // --- END RACE FORM FUNCTIONS ---

  // --- MAP ROUTE AND LOCATION FUNCTIONS ---
  triggerMapFileUpload() {
    this.mapFileInput.click();
  }
  onSelectMapFileChange(e:any) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    var mapFileInput = this.form.get('mapFile');
    if (
      mapFileInput.invalid
      ||
      e.target.files == null
      ||
      (e.target.files && e.target.files.length == 0)
    ) {
      console.log("SOMETHING IS WRONG:",mapFileInput.invalid, e.target.files==null,(e.target.files&&e.target.files.length==0));
      this.mapFile = {
        data:null,
        filename:""
      };
      this.mapFileLoading = false;
      this.valueChange('mapFile');
      return;
    }

    this.mapFileLoading = true;
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = () => {
      this.mapFile = {
        data:reader.result,
        filename: (file.name) ? file.name : "Unknown file name"
      };
      this.mapFileLoading = false;
      this.valueChange('mapFile');
    }
    reader.readAsDataURL(file);
  }
  findClosestLocations(key:string) {
    if (
      !key || 
      key.trim().length == 0 || 
      (key != "startLoc" && key != "endLoc")
    ) return;

    var loc = this.form.get(key);
    if (loc.value.trim().length == 0) {
      loc.setErrors({missing:true});
      this.valueChange(key);
      return;
    }
    
    loc.setErrors(null);
    this._coordinateService.getLocation(loc.value.trim()).then((resp:MapBoxPlaceResp) => {
      this.locationOptions[key] = resp.features;
      this.valueChange(key);
    });
  }
  selectLocationOption(option:any, key:string) {
    if (key != "startLoc" && key != "endLoc") return;
    this.locationOptions[key] = null;
    this.form.get(key).setValue(option.place_name);
    this.valueChange(key);
    if (key == "startLoc") {
      this.form.get('startLon').setValue(option.center[0]);
      this.form.get('startLat').setValue(option.center[1]);
      this.valueChange('startLat');
      this.valueChange('startLon');
    } else {
      this.form.get('endLon').setValue(option.center[0]);
      this.form.get('endLat').setValue(option.center[1]);
      this.valueChange('endLat');
      this.valueChange('endLon');
    }
  }
  clearLocationOptions(key:string) {
    switch(key) {
      case "startLoc":
        this.locationOptions.startLoc = null;
        break;
      case "endLoc":
        this.locationOptions.endLoc = null;
        break;
    }
    return;
  } 
  generateRouteFile(event:any, extension:string = 'json') {
    event.preventDefault();
    event.stopPropagation();

    var startLoc = this.form.get('startLoc'),
        startLat = this.form.get('startLat'),
        startLon = this.form.get('startLon'),
        endLoc = this.form.get('endLoc'),
        endLat = this.form.get('endLat'),
        endLon = this.form.get('endLon'),
        hasErrors = false;
    this.generateError = null;
    this.generatingRoute = true;

    if (
      startLoc.errors != null ||
      endLoc.errors != null ||
      startLat.errors != null || 
      startLon.errors != null ||
      endLat.errors != null ||
      endLon.errors != null
    ) {
      this.generateError = "You must provide the coordinates for your starting and ending locations to generate a route.";
      this.generatingRoute = false;
      return;
    }

    const start_coord:MapBoxCoord = {
      lon:startLon.value,
      lat:startLat.value,
    };
    const end_coord:MapBoxCoord = {
      lon:endLon.value,
      lat:endLat.value,
    };

    this._coordinateService.getCoordinates(start_coord,end_coord).then((resp:GraphHopperResp) => {
      let distanceUnits = "miles";
      switch(resp.dist_unit) {
        case 'Mi':
          distanceUnits = 'miles';
          break;
        case 'KM':
          distanceUnits = 'kilometers';
          break;
        default:
          distanceUnits = "miles";
      }

      // Save coords and set on RouteData var to preview on map
      this.coords = resp.coords;
      this.setRouteDataFromCoords(this.coords);

      // const distance = resp.distance;
      const content = (extension == 'gpx') 
        ? this.createGPXXmlString(this.coords['route1'].coords) 
        : this.createJSONString(this.coords, false);
      //const url = 'data:text/json;charset=utf-8,' + content;
      const date = Date.now();
      const filename = this.raceData.name.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() + '-' + date + '.' + extension;
      var reader = new FileReader();
      reader.onload = () => {
        this.mapFile = {
          data:reader.result,
          filename:filename,
        };
        console.log("CALLING MAP FILE CHANGE FROM generateRouteFile");
        this.valueChange('mapFile');
        this.generateError = null;
      }
      reader.readAsDataURL(new Blob([content], {type:"application/json"}));
      
    }).catch(error=>{
      console.error(error);
      this.generateError = `Error: Unable to generate route file: ${error.message}`;
    }).finally(()=>{
      this.generatingRoute = false;
    });
  }
  createGPXXmlString(lines: number[][]): string {
    // let result = '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="runtracker"><metadata/><trk><name></name><desc></desc>'
    let result = `<gpx xmlns="https://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="TucanFitness"><metadata/><trk><name>${this.raceData.name}</name><desc></desc>`
    result += lines.reduce((accum, curr) => {
      let segmentTag = '<trkseg>';
      // segmentTag += curr.map((point) => `<trkpt lat="${point[1]}" lon="${point[0]}"><ele>${point[2]}</ele></trkpt>`).join('');
      segmentTag += `<trkpt lat="${curr[1]}" lon="${curr[0]}"></trkpt>`;
      segmentTag += '</trkseg>'
  
      return accum += segmentTag;
    }, '');
    result += '</trk></gpx>';
    return result;
  }
  createJSONString(routes:any, encode:Boolean = true):string {
    if (
      routes == null ||
      Object.keys(routes).length == 0
    ) return null;
    // Routes must be structured like so:
    // {
    //    route1:{
    //      coords:[ ... ]
    //    }
    //}
    var res = Object.keys(routes).reduce((accumulator,routeName)=>{
      if (routes[routeName].coords && routes[routeName].coords.length>2) accumulator[routeName] = routes[routeName];
      return accumulator;
    },{});
    if (Object.keys(res).length==0) return null;
    if (encode) return encodeURIComponent(JSON.stringify(res,null,2));
    return JSON.stringify(res,null,2);
  }
  downloadRouteFile () {
    const value = this.mapFile;
    if (value == null || value.data == null) {
      return;
    }
    const link = document.createElement('a');
    link.download = value.filename;;
    //link.download = `${distance}-${distUnit}.${fileExtension}`;
    link.href = value.data;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    //let tempEvent = {target:{files:[]}}
    //tempEvent.target.files.push(url);
    //this.onSelectMapFileChange(tempEvent,filename);
  };
  // --- END MAP ROUTE AND LOCATION FUNCTIONS ---

  // --- DISTANCE FUNCTIONS ---
  milesToKilometers(mi:any) {
    const miles = (typeof mi === "number") ? mi : parseFloat(mi);
    return miles / 0.62137;
  }
  kilometersToMiles(km:any) {
    const kilometers = (typeof km === "number") ? km : parseFloat(km);
    return km * 0.62137;
  }
  // --- END DISTANCE FUNCTIONS ---
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