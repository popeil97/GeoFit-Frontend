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
      startLoc: new FormControl('',[
        Validators.required,
      ]),
      endLoc: new FormControl('', [
        Validators.required,
      ]),
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
      {
        name: 'Ocala, FL'
      },
      {
        name: 'Gainesville, FL'
      }
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

  selectOption(option:any, key:string) {
    console.log('TEST:',option);
    if(key == 'startLoc') {
      this.selectedStartLoc = option;
    }

    else {
      this.selectedEndLoc = option;
    }
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
        //this.map.clearMap();
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