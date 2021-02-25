import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { CoordinatesService } from '../coordinates.service';
import { MapComponent } from '../map/map.component';
import { RaceService } from '../race.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';

import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { Register2Component } from '../register2/register2.component';

@Component({
  selector: 'app-race-create',
  templateUrl: './race-create.component.html',
  styleUrls: ['./race-create.component.css']
})
export class RaceCreateComponent implements OnInit {

  @ViewChild(MapComponent) map:MapComponent;

  // --- Initializing form groups ---
  raceForm:FormGroup;
  raceRouteForm:FormGroup;
  raceMerchandiseForm:FormGroup;

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

  raceType:RaceTypes;
  raceTypeOptions = [
    {
      name:'Run/Walk',
      type:RaceTypes.RUN_WALK
    },{
      name:'Ride',
      type:RaceTypes.RIDE
    },{
      name:'Any',
      type:RaceTypes.ANY
    }
  ];

  private bannerInput;
  public bannerURL: any;
  public bannerLoading: boolean = false;

  constructor(
    private _coordinateService:CoordinatesService,
    private _raceService:RaceService,
    private _authService:AuthService,
    private router:Router,
    private dialog:MatDialog,
  ) { 
    this.raceForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.maxLength(30),
      ]),
      description: new FormControl('',[
        Validators.required,
      ]),
      startDate: new FormControl('',[
        Validators.required,
      ]),
      endDate: new FormControl('',[
        Validators.required,
      ]),
      startLoc: new FormControl(''),
      endLoc: new FormControl(''),
      public: new FormControl(false,[
        Validators.required,
      ]),
      raceType: new FormControl('',[
        Validators.required,
      ]),

      routeFile: new FormControl(''),
      teams:new FormControl(false),
      teamSize: new FormControl(1),
      manual:new FormControl(false),
      registrationFee:new FormControl(0.00,[
        Validators.required,
      ]),
      bannerFile: new FormControl(''),
    });
    this.raceRouteForm = new FormGroup({
      raceId: new FormControl('',[
        Validators.required,
      ]),
      routeFile: new FormControl('',[
        Validators.required,
      ]),
      startLoc: new FormControl(''),
      endLoc: new FormControl(''),
    });
    this.raceMerchandiseForm = new FormGroup({
      raceId: new FormControl('',[
        Validators.required,
      ]),
      productName: new FormControl('', [
        Validators.required,
      ]),
      productDescription: new FormControl(''),
      productImage: new FormControl(''),
      productType: new FormControl(''),
      productState: new FormControl(''),
      productDetail: new FormControl(''),
      productPhysical: new FormControl(true),
      productShippingLimitations: new FormControl(''),
    })


    this.options = [
      {name: 'Ocala, FL'},
      {name: 'Gainesville, FL'}
    ];

  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.bannerInput = document.getElementById("bannerPreviewInput");
  }

  openLogin = () => {
    let d = this.dialog.open(LoginComponent,{
      panelClass:"LoginContainer",
      data:{register:false}
    });
    d.afterClosed().subscribe(result=>{
      console.log("CLOSE LOGIN FROM to_race_creators", result);
    })
  }

  openRegister = () => {
    let d = this.dialog.open(Register2Component, {
      panelClass:"RegisterContainer",
      data:{register:false},
    });
    d.afterClosed().subscribe(result=>{
      console.log("CLOSE REGISTER FROM to_race_creators", result);
    })
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

  selectRaceType(option:any) {
    this.raceType = option.type;
  }


  clearForm() {
    this.selectedEndLoc = null;
    this.selectedStartLoc = null;
    this.raceForm.reset();
  }

  submitRaceForm() {
    let formClean = this.raceForm.value as RaceForm;
    console.log(this.raceForm.valid);

    /*
    let isValid: Boolean = this.raceForm.valid;

    if(isValid) {

      formClean.start_lon = this.selectedStartLoc.center[0];
      formClean.start_lat = this.selectedStartLoc.center[1];

      formClean.end_lon = this.selectedEndLoc.center[0];
      formClean.end_lat = this.selectedEndLoc.center[1];

      formClean.raceType = this.raceType;

      formClean.routeFile = this.uploadeUrl;

      this._raceService.createRace(formClean).then((resp:FromResp) => {
        console.log('CREATE RESP:',resp)

        this.router.navigate(['/about',{name:resp.name,id:resp.race_id}]);
      });

      this.raceForm.reset();
    }
    */
  }

  findClosestLocations(key:string) {
    if (
      !key || 
      key.trim().length == 0 || 
      (key != "startLoc" && key != "endLoc")
    ) return;

    var loc = this.raceForm.get(key);
    if (loc.value.trim().length == 0) {
      loc.setErrors({missing:true});
      return;
    }
    
    loc.setErrors(null);
    this._coordinateService.getLocation(loc.value.trim()).then((resp:MapBoxPlaceResp) => {
      if(key == 'startLoc') {
        this.selectedStartLoc = null;
        this.startOptions = resp.features;
      }
      else if (key == 'endLoc') {
        this.selectedEndLoc = null;
        this.endOptions = resp.features;
      }
    });
  }
  selectLocationOption(option:any, key:string) {
    switch(key) {
      case "startLoc":
        this.selectedStartLoc = option;
        this.startOptions = null;
        this.raceForm.get('startLoc').setValue(option.place_name);
        break;
      case "endLoc":
        this.selectedEndLoc = option;
        this.endOptions = null;
        this.raceForm.get('endLoc').setValue(option.place_name);
        break;
    }
  }
  clearLocationOptions(key:string) {
    switch(key) {
      case "startLoc":
        this.startOptions = null;
        break;
      case "endLoc":
        this.endOptions = null;
        break;
    }
  } 
  preview() {
    var startLoc = this.raceForm.get('startLoc'),
        endLoc = this.raceForm.get('endLoc');
    var hasErrors = false;

    if (startLoc.value.trim().length == 0) {
      hasErrors = true;
      startLoc.setErrors({missing:true});
    } 
    else if (this.selectedStartLoc == null) {
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
    else if (this.selectedEndLoc == null) {
      hasErrors = true;
      endLoc.setErrors({unselected:true});
    }
    else {
      endLoc.setErrors(null);
    }
    if (hasErrors) return;

    // We should have start and end location options already saved
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
      //this.map.clearMap();
      this.coords = resp.coords;
      this.isPreviewMode = true;
      this.previewDistance = resp.distance.toString() + resp.dist_unit
      this.loading=false;
    });
    
    /*
    // testing location services
    var startLocPromise = this._coordinateService.getLocation(startLoc.value.trim()),
        endLocPromise = this._coordinateService.getLocation(endLoc.value.trim());
    Promise.all([startLocPromise, endLocPromise]).then(locations => {
      console.log('LOCATIONS',locations);
      var startResponse = locations[0] as MapBoxPlaceResp,
          endResponse = locations[1] as MapBoxPlaceResp;
      var startFeatures:MapBoxPlace[] = startResponse.features,
          endFeatures:MapBoxPlace[] = endResponse.features;
      
    }).catch(locationErrors=>{
      console.log('ERROR GETTING LOCATION:',locationErrors);
      // Never had something like this happen, but I suppose it can happen...
    });
    */

    /*
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
    */
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      let file = event.target.files[0];
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadeUrl = reader.result;
      }
    }
  }

  // --- All Banner-Related Functions ---
  onSelectBannerTrigger() {
    this.bannerInput.click();
  }
  onSelectBannerFile(e) {
    if (e.target.files && e.target.files[0]) {
      this.bannerLoading = true;
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.bannerURL = reader.result;
        this.bannerLoading = false;
      }
    }
  }
  // --- End Banner-Related Functions ---

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

// --- All Race Form Interfaces ---
interface RaceForm {
  name:string,        // The race's name. Required, maxLength==30
  start_lon:number,   // The race's starting longitude
  start_lat:number,   // The race's starting latitude
  end_lon:number,     // The race's ending longitude
  end_lat:number,     // The race's ending latitude
  valid:Boolean,      // ???
  startDate:string,   // The race's starting date. Required
  endDate:string,     // The race's ending date. Required
  startLoc:string,    // The race's starting location
  endLoc:string,      // The race's ending location
  public:Boolean,     // Is the race public/viewable?
  routeFile:any,      // The route file. JSON or GP-something
  raceType:RaceTypes, // The race's type. Required
  /*
  description:string,   // The race's description.
  teams:Boolean,
  teamSize:number,
  manual:Boolean,
  registrationFee:number,
  */
}
interface RaceRouteForm {
  raceId:string,
  routeFile:any,
  startLoc:string,
  endLoc:string,
}
interface RaceMerchandiseForm {
  raceId:string,
  productName:string,
  productDescription:string,
  productImage:any,
  productType:string,
  productState:string,
  productDetail:RaceMerchandiseDetails,
  productPhysical:Boolean,
  productShippingLimitations:string,
}
  interface RaceMerchandiseDetails {
    size:string,
    color:string,
    material:string,
    price:number,
  }
// --- End Race Form Interfaces ---

enum RaceTypes {
  RUN_WALK=1,
  RIDE=2,
  ANY=3,
}

interface FromResp {
  race_id:number;
  name:string;
}