import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RaceService } from '../../../race.service';
import { Router } from '@angular/router';

import { cannotBeEmptyString, requiredFileType } from '../race-dashboard.component';

@Component({
  selector: 'app-race-basics',
  templateUrl: './race-basics.component.html',
  styleUrls: ['./race-basics.component.css']
})
export class RaceBasicsComponent implements OnInit {

  // We theoretically can pull the raceID from the raceData data, but we should be safe here and try to pass it via Angular Input instead
  @Input() raceID:number;
  @Input() raceData:any;
  @Input() getRaceDataCallback: (callback:any) => void;

  // --- Initializing form groups ---
  raceBasicsForm:FormGroup;
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
    private raceTypeOptionDictionary = {
      'Run/Walk':RaceTypes.RUN_WALK,
      'Ride':RaceTypes.RIDE,
      'Any':RaceTypes.ANY
    }
    private bannerInput;
    private bannerURLTypes: Array<string> = ['png','jpg','jpeg'];
    public bannerURL: any;
    public bannerLoading: boolean = false;
    public hasSubmitted: boolean = false;
    public validatingSubmission:boolean = false;
    public createSuccess: boolean = false;
    public createResponse: any = null;

    public loading:boolean = true;
    public changedValues = [];

  constructor(
    private _raceService:RaceService,
  ) {}

  ngOnInit() {
    //console.log(this.raceID, this.raceData);
    this.initializeRaceBasicsForm();
  }
  ngAfterViewInit() {
    this.bannerInput = document.getElementById("bannerPreviewInput");
  }

  initializeRaceBasicsForm() {
    
    this.loading = true;
    this.validatingSubmission = false;

    if (this.raceID == null || this.raceData == null) {
      this.loading = false;
      return;
    }

    this.raceType = this.raceData.raceType;
    this.bannerURL = this.raceData.bannerFile;
    // TODO: get banner URL from race data and save it in this.bannerURL

    // The form control needed to operate the race basics form
    this.raceBasicsForm = new FormGroup({
      name: new FormControl(this.raceData.name,[
        Validators.required,
        cannotBeEmptyString(),
        Validators.maxLength(30),
      ]),
      description: new FormControl(this.raceData.description,[
        Validators.required,
        cannotBeEmptyString(),
        Validators.maxLength(2000),
      ]),
      startDate: new FormControl(this.raceData.startDate,[
        Validators.required,
        cannotBeEmptyString(),
      ]),
      endDate: new FormControl(this.raceData.endDate,[
        Validators.required,
        cannotBeEmptyString(),
      ]),
      bannerFile: new FormControl(this.raceData.bannerFile,[
        requiredFileType(false, this.bannerURLTypes),
      ]),
      raceType: new FormControl(this.raceTypeDictionary(RaceTypes[this.raceData.raceType]),[
        Validators.required,
      ]),
    });

    this.loading = false;
  }
  resetForm = () => {
    this.initializeRaceBasicsForm();
    this.changedValues = [];
  }


  selectRaceType(option:any) {
    this.raceType = option.type;
    this.valueChange('raceType')
  }
  selectRaceTypeEvent(option_name:string) {
    this.raceType = this.raceTypeOptionDictionary[option_name];
    this.valueChange('raceType');
  }
  raceTypeDictionary(name:string) {
    var val = null;
    switch(name) {
      case 'RUN_WALK':
        val = 'Run/Walk';
        break;
      case 'RIDE':
        val = "Ride"
        break;
      case 'ANY':
        val = "Any"
        break;
    }
    return val;
  }

  // --- All Banner-Related Functions ---
  onSelectBannerTrigger() {
    this.bannerInput.click();
  }
  onSelectBannerFileChange(e:any) {
    var bannerInput = this.raceBasicsForm.get('bannerFile');
    //console.log(bannerInput.value, bannerInput.errors);
    if (
      bannerInput.invalid
      ||
      e.target.files == null
      ||
      (e.target.files && e.target.files.length == 0)
    ) {
      console.log("SOMETHING IS WRONG:",bannerInput.invalid, e.target.files==null,(e.target.files&&e.target.files.length==0));
      this.bannerURL = null;
      this.bannerLoading = false;
      return;
    }

    this.bannerLoading = true;
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      this.bannerURL = reader.result;
      //console.log(this.bannerURL);
      this.bannerLoading = false;
      this.valueChange('bannerFile');
    }
    reader.readAsDataURL(file);
  }
  cancelBannerImage(e:any) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.bannerURL = this.raceData.bannerFile;
    this.bannerLoading = false;
    this.raceBasicsForm.get('bannerFile').reset();

    let index = this.changedValues.indexOf('bannerFile');
    if (index > -1) this.changedValues.splice(index, 1);
  }
  removeBannerImage(e:any) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.bannerURL = null;
    this.bannerLoading = false;
    this.raceBasicsForm.get('bannerFile').setValue(null);

    let index = this.changedValues.indexOf('bannerFile');
    if (this.bannerURL != this.raceData.bannerFile) {
      if (index == -1) this.changedValues.push('bannerFile');
    }
    else {
      if (index > -1) this.changedValues.splice(index, 1);
    }
  }
  // --- End Banner-Related Functions ---

  valueChange(key:string) {
    let changed = false;
    switch(key) {
      case 'bannerFile':
        if (this.raceBasicsForm.get('bannerFile').value != this.bannerURL) {
          if (this.changedValues.indexOf('bannerFile') == -1) this.changedValues.push(key);
          changed = true;
        }
        else {
          let index = this.changedValues.indexOf('bannerFile');
          if (index > -1) this.changedValues.splice(index, 1);
        }
        break;
      case 'raceType':
        if (this.raceType != this.raceData.raceType) {
          if (this.changedValues.indexOf('raceType') == -1) this.changedValues.push(key);
          changed = true;
        }
        else {
          let index = this.changedValues.indexOf('raceType');
          if (index > -1) this.changedValues.splice(index, 1);
        }
        break;
      default:
        if (this.raceBasicsForm.get(key).value != this.raceData[key]) {
          if (this.changedValues.indexOf(key) == -1) this.changedValues.push(key);
          changed = true;
        }
        else {
          let index = this.changedValues.indexOf(key);
          if (index > -1) this.changedValues.splice(index, 1);
        }
    }
  }
  isFormValid(f:FormGroup):Boolean { 
    if (!f.disabled) return f.valid;
    return Object.keys(f.controls).reduce((accumulator,inputKey)=>{
      return (accumulator && f.get(inputKey).errors == null);
    },true);
  }
  onRaceBasicsFormSubmit() {
    
    if (this.validatingSubmission) {
      console.log("We've already submitted...");
      return;
    }

    this.hasSubmitted = true;
    this.validatingSubmission = true;
    this.raceBasicsForm.disable();

    const isValid = this.isFormValid(this.raceBasicsForm);

    if (isValid && this.changedValues.length > 0) {
      console.log('form is valid!');
      let formClean = {};
      this.changedValues.forEach(key=>{
        switch(key) {
          case 'bannerFile':
            formClean['raceImage'] = this.bannerURL;
            break;
          case 'raceType':
            formClean['raceType'] = this.raceType;
            break;
          default:
            formClean[key]=this.raceBasicsForm.get(key).value;
        }
      });

      this._raceService.updateRaceAbout(formClean, this.raceID).then((resp:updateResp)=>{
        //console.log(resp);
        if (resp.success) {
          this.getRaceDataCallback(()=>{
            this.resetForm();
            alert("Your race information has been successfully updated");
          });
        } 
        else throw(new Error('Unsuccessful Update'));
      }).catch(error=>{
        console.error(error);
        alert("Your race was unable to be updated. Please try again later");
      }).finally(()=>{
        this.raceBasicsForm.enable();
        this.validatingSubmission = false;
      });
    } else {
      // validate all form fields
      this.raceBasicsForm.enable();
      Object.keys(this.raceBasicsForm.controls).forEach(field => {
        const control = this.raceBasicsForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.validatingSubmission = false;
    }
  }

}

interface updateResp {
  success:Boolean
}
enum RaceTypes {
  RUN_WALK=1,
  RIDE=2,
  ANY=3,
}










/*
@Component({
  selector: 'app-race-create',
  templateUrl: './race-create.component.html',
  styleUrls: ['./race-create.component.css']
})
export class RaceCreateComponent implements OnInit {

  @ViewChild(MapComponent) map:MapComponent;

  // --- Initializing form groups ---
  raceBasicsForm:FormGroup;
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
    private bannerURLTypes: Array<string> = ['png','jpg','jpeg'];
    public bannerURL: any;
    public bannerLoading: boolean = false;
    public hasSubmitted: boolean = false;
    public createSuccess: boolean = false;
    public createResponse: any = null;



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

  constructor(
    private _coordinateService:CoordinatesService,
    private _raceService:RaceService,
    private _authService:AuthService,
    private router:Router,
    private dialog:MatDialog,
  ) { 

    this.initializeRaceBasicsForm();

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

  ngOnInit() {
    this.coords = null;
  }

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
  navigateTo(url:string = null) {
    if (url != null) this.router.navigate([url]);
  }
  navigateToDashboard() {
    if (this.createResponse == null) return;
    this.router.navigate(['/dashboard',{id:this.createResponse.race_id}]);
  }

  initializeRaceBasicsForm() {
    // The form control needed to operate the race basics form
    this.raceBasicsForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        cannotBeEmptyString(),
        Validators.maxLength(30),
      ]),
      description: new FormControl('',[
        Validators.required,
        cannotBeEmptyString(),
        Validators.maxLength(2000),
      ]),
      startDate: new FormControl('',[
        Validators.required,
        cannotBeEmptyString(),
      ]),
      endDate: new FormControl('',[
        Validators.required,
        cannotBeEmptyString(),
      ]),
      bannerFile: new FormControl(null,[
        requiredFileType(false, this.bannerURLTypes),
      ]),
      raceType: new FormControl('',[
        Validators.required,
      ]),
    });
  }

  selectRaceType(option:any) {
    this.raceType = option.type;
  }


  // --- All Banner-Related Functions ---
  onSelectBannerTrigger() {
    this.bannerInput.click();
  }
  onSelectBannerFileChange(e:any) {
    var bannerInput = this.raceBasicsForm.get('bannerFile');
    if (
      bannerInput.invalid
      ||
      e.target.files == null
      ||
      (e.target.files && e.target.files.length == 0)
    ) {
      this.bannerURL = null;
      this.bannerLoading = false;
      return;
    }
    
    // if (e.target.files && e.target.files[0]) {
    this.bannerLoading = true;
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      this.bannerURL = reader.result;
      this.bannerLoading = false;
    }
    reader.readAsDataURL(file);
    // }
  }
  // --- End Banner-Related Functions ---

  onRaceBasicsFormSubmit() {
    this.hasSubmitted = true;
    if (this.raceBasicsForm.valid) {
      console.log('form is valid!');
      let formClean = this.raceBasicsForm.value as RaceBasicsForm;
      formClean.raceType = this.raceType;
      if (this.bannerURL) formClean.raceImage = this.bannerURL;
      formClean.startLoc = "Boston, Massachusetts, USA";
      formClean.start_lon = -71.05708;
      formClean.start_lat = 42.36115;
      formClean.endLoc = "New York, New York, USA";
      formClean.end_lon = 127.02461;
      formClean.end_lat = 37.53260;
      formClean.public = false;
      console.log('FORM DATA TO SEND: ', formClean)
      this._raceService.createRace(formClean).then((resp:FromResp) => {
        console.log('CREATE RESP:',resp);
        
        this.createSuccess = true;
        this.createResponse = resp;

        this.hasSubmitted = false;
        this.bannerURL = null;
        this.raceBasicsForm.reset();
        this.raceBasicsForm.markAsPristine();
        this.raceBasicsForm.markAsUntouched();
        this.initializeRaceBasicsForm();
        //this.router.navigate(['/about',{name:resp.name,id:resp.race_id}]);
      });
    } else {
      // validate all form fields
      Object.keys(this.raceBasicsForm.controls).forEach(field => {
        const control = this.raceBasicsForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }


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


  clearForm() {
    this.selectedEndLoc = null;
    this.selectedStartLoc = null;
    this.raceForm.reset();
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
interface RaceBasicsForm {

  name: string,         // The race's name. Required, maxLength = 30
  description: string,  // The race's description. Required, maxLength = 2,000   UNKNOWN IF IMPLEMENTED IN BACKEND
  startDate:string,     // The race's starting date. Required
  endDate:string,       // The race's ending date. Required
  raceImage:any,        // The race's image file. NOT required
  raceType:RaceTypes,   // The race's type. Required

  startLoc:string,      // Shouldn't be here...
  endLoc:string,        // Shouldn't be here...
  start_lon:number,     // Shouldn't be here...
  start_lat:number,     // Shouldn't be here...
  end_lon:number,       // Shouldn't be here...
  end_lat:number,       // Shouldn't be here...
}
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

  description:string,   // The race's description.
  teams:Boolean,
  teamSize:number,
  manual:Boolean,
  registrationFee:number,
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



interface FromResp {
  race_id:number;
  name:string;
}
*/