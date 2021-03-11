import { Component, OnInit, Input } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';

import { CoordinatesService } from '../../coordinates.service';

@Component({
  selector: 'app-race-mapupload',
  templateUrl: './race-mapupload.component.html',
  styleUrls: ['./race-mapupload.component.css']
})
export class RaceMapuploadComponent implements OnInit {

  @Input() raceID:number = null;
  @Input() raceData:any = null;
  @Input() getRaceDataCallback: () => void;

  public loading:Boolean = true;
  public checkingValidityOfSubmission:Boolean = true;

  public form:FormGroup = null;
  public locations = {
    startLoc:{
      selectedLoc:null,
      options:null,
    },
    endLoc:{
      selectedLoc:null,
      options:null,
    }
  }
  public mapFileURL:any = null;
  public mapFileLoading:Boolean = false;

  public previewLoading:Boolean = false;

  constructor(
    private _coordinateService:CoordinatesService,
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  // --- RACE FORM FUNCTIONS ---
  initializeForm() {
    this.loading = true;

    this.mapFileURL = null;
    this.mapFileLoading = false;
    
    this.form = new FormGroup({  
      startLoc:new FormControl(this.raceData.start_loc,[
        Validators.required
      ]),
      endLoc:new FormControl(this.raceData.end_loc,[
        Validators.required
      ]),
      mapFile:new FormControl(null,[
        Validators.required,
      ]),
    });
    this.loading = false;
  }
  onFormSubmit() {
    this.checkingValidityOfSubmission = true;
    this.checkingValidityOfSubmission = false;
  }
  // --- END RACE FORM FUNCTIONS ---

  // --- MAP ROUTE AND LOCATION FUNCTIONS ---
  onSelectMapFileChange(e) {
    var mapFileInput = this.form.get('mapFile');
    if (
      mapFileInput.invalid
      ||
      e.target.files == null
      ||
      (e.target.files && e.target.files.length == 0)
    ) {
      console.log("SOMETHING IS WRONG:",mapFileInput.invalid, e.target.files==null,(e.target.files&&e.target.files.length==0));
      this.mapFileURL = null;
      this.mapFileLoading = false;
      return;
    }

    this.mapFileLoading = true;
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      this.mapFileURL = reader.result;
      this.mapFileLoading = false;
      //this.valueChange('mapFile');
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
      return;
    }
    
    loc.setErrors(null);
    this._coordinateService.getLocation(loc.value.trim()).then((resp:MapBoxPlaceResp) => {
      this.locations[key] = {
        selectedLoc:null,
        options:resp.features,
      }
    });
  }
  selectLocationOption(option:any, key:string) {
    if (key != "startLoc" && key != "endLoc") return;
    this.locations[key] = {
      selectedLoc:option,
      options:null,
    }
    this.form.get(key).setValue(option.place_name);
  }
  clearLocationOptions(key:string) {
    switch(key) {
      case "startLoc":
        this.locations.startLoc.options = null;
        break;
      case "endLoc":
        this.locations.endLoc.options = null;
        break;
    }
    return;
  } 
  generateRouteFile() {
    var startLoc = this.form.get('startLoc'),
        endLoc = this.form.get('endLoc');
    var hasErrors = false;

    if (startLoc.value.trim().length == 0) {
      hasErrors = true;
      startLoc.setErrors({missing:true});
    } 
    else if (this.locations.startLoc.selectedLoc == null) {
      hasErrors = true;
      startLoc.setErrors({unselected:true});
    }
    else {
      startLoc.setErrors(null);
    }
    if (endLoc.value.trim().length == 0) {
      hasErrors = true;
      endLoc.setErrors({missing:true});
    } 
    else if (this.locations.endLoc.selectedLoc == null) {
      hasErrors = true;
      endLoc.setErrors({unselected:true});
    }
    else {
      endLoc.setErrors(null);
    }
    if (hasErrors) return;


    // We should have start and end location options already saved
    this.previewLoading=true;
    let start_coord:MapBoxCoord = this.locations.startLoc.selectedLoc.center;
    let end_coord:MapBoxCoord = this.locations.endLoc.selectedLoc.center;

    start_coord.lon = this.locations.startLoc.selectedLoc.center[0];
    start_coord.lat = this.locations.startLoc.selectedLoc.center[1];
    end_coord.lon = this.locations.endLoc.selectedLoc.center[0];
    end_coord.lat = this.locations.endLoc.selectedLoc.center[1];

    console.log(start_coord);
    console.log(end_coord);

    this._coordinateService.getCoordinates(start_coord,end_coord).then((resp:GraphHopperResp) => {
      console.log('RESP:',resp);
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
      this.downloadRouteFile(resp.coords, resp.distance, distanceUnits, 'json');
      //this.map.clearMap();
      /*
      this.coords = resp.coords;
      this.isPreviewMode = true;
      this.previewDistance = resp.distance.toString() + resp.dist_unit
      */
      this.previewLoading = false;
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
  createJSONString(routes:any):string {
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
    return encodeURIComponent(JSON.stringify(res));
  }
  downloadRouteFile (coords:any, distance: number, distUnit:string, fileExtension:string = "json") {
    const content = (fileExtension == 'gpx') ? this.createGPXXmlString(coords['route1'].coords) :  this.createJSONString(coords);
    const url = 'data:text/json;charset=utf-8,' + content;
    const link = document.createElement('a');
    const filename = this.raceData.name.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
    //link.download = `${distance}-${distUnit}.${fileExtension}`;
    link.download = `${filename}.${fileExtension}`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --- END MAP ROUTE AND LOCATION FUNCTIONS ---

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