import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { 
  AuthService,
  RaceService,
  RouterService,
  TucanValidators,
} from '../../services';

import { 
  LoginComponent,
  RegisterComponent,
} from '../../popups';

import {
  MapBoxCoord
} from '../../interfaces';

@Component({
  selector: 'app-race-create',
  templateUrl: './race-create.component.html',
  styleUrls: [
    './race-create.component.css',
    '../../../styles/forms.css'
  ]
})
export class RaceCreateComponent implements OnInit,AfterViewInit,OnDestroy {

  // --- Initializing subscribers
  private loginSubscription:any = null;

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
  private bannerInput:any = null;
  private bannerURLTypes: Array<string> = ['png','jpg','jpeg'];
  public bannerURL: any;
  public bannerLoading: boolean = false;
  public hasSubmitted: boolean = false;
  public verifyingFormSubmission:boolean = false;
  public createSuccess: boolean = false;
  public createResponse: any = null;

  loading:Boolean = false;
  private initialValues:any = {
    "name": "",
    "description": "",
    "startDate": "",
    "endDate": "",
    "bannerFile": null,
    "raceType": ""
  };
  private formChangeSubscription:any = null;

  constructor(
    private authService:AuthService,
    private raceService:RaceService,
    private router:Router,
    private routerService:RouterService,
    private dialog:MatDialog,
  ) {
    this.loginSubscription = this.authService.getLoginStatus.subscribe(this.handleLoginChange);
  }

  ngOnInit() {
    this.initializeRaceBasicsForm();
  }

  ngAfterViewInit() {
    this.bannerInput = document.getElementById("bannerPreviewInput");
  }

  ngOnDestroy() {
    this.bannerInput = null;
    this.bannerURL = null;
    this.raceBasicsForm = null;
    this.createResponse = null;
    this.loginSubscription.unsubscribe();
    this.loginSubscription = null;
    this.formChangeSubscription = null;
  }

  handleLoginChange = (loggedIn:Boolean) => {
    if (loggedIn) {
      this.initializeRaceBasicsForm();
      this.bannerInput = document.getElementById("bannerPreviewInput");
    }
  }

  openLogin = () => {
    const d = this.dialog.open(LoginComponent,{
      panelClass:"LoginContainer",
    });
    const sub = d.componentInstance.openRegister.subscribe(()=>{
      this.openRegister();
    })
    d.afterClosed().subscribe(result=>{
      console.log("Closing Login from Race Create");
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    })
  }
  openRegister = () => {
    const d = this.dialog.open(RegisterComponent, {
      panelClass:"RegisterContainer",
    });
    const sub = d.componentInstance.openLogin.subscribe(() => {
      this.openLogin();
    });
    d.afterClosed().subscribe(result=>{
      console.log("Close Register from Race Create")
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    })
  }
  navigateTo(url:string = null) {
    if (url != null) this.routerService.navigateTo(url);
  }
  navigateToDashboard() {
    if (this.createResponse == null) return;
    this.routerService.navigateTo('/dashboard',{id:this.createResponse.race_id},true);
  }

  initializeRaceBasicsForm() {
    // The form control needed to operate the race basics form
    this.raceBasicsForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        TucanValidators.cannotBeEmptyString(),
        Validators.maxLength(30),
      ]),
      description: new FormControl('',[
        Validators.required,
        TucanValidators.cannotBeEmptyString(),
        Validators.maxLength(2000),
      ]),
      startDate: new FormControl('',[
        Validators.required,
        TucanValidators.cannotBeEmptyString(),
      ]),
      endDate: new FormControl('',[
        Validators.required,
        TucanValidators.cannotBeEmptyString(),
      ]),
      bannerFile: new FormControl(null,[
        TucanValidators.requiredFileType(false, this.bannerURLTypes),
      ]),
      raceType: new FormControl('',[
        Validators.required,
      ]),
    });
    if (this.formChangeSubscription == null) this.formChangeSubscription = this.raceBasicsForm.valueChanges.subscribe(this.valueChanged);
  }
  valueChanged = (values:any) => {
    const changed = Object.keys(values).reduce((accumulator:Boolean,inputKey:string)=>{
      return (accumulator ||  values[inputKey] != this.initialValues[inputKey]);
    },false);
    this.routerService.formHasChanged(changed);
  }
  validForm = () => {
    return TucanValidators.isFormValid(this.raceBasicsForm);
  }

  selectRaceType(option:any) {
    this.raceType = option.type;
  }
  selectRaceTypeEvent(option_name:string) {
    this.raceType = this.raceTypeOptionDictionary[option_name];
  }


  // --- All Banner-Related Functions ---
  onSelectBannerTrigger() {
    this.bannerInput.click();
  }
  onSelectBannerFileChange(e:any) {
    console.log("CALLING FILECHANGE");
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
  cancelBannerImage(e:any) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.bannerURL = null;
    this.bannerLoading = false;
    this.raceBasicsForm.get('bannerFile').reset();
  }
  // --- End Banner-Related Functions ---

  onRaceBasicsFormSubmit() {
    this.hasSubmitted = true;
    this.verifyingFormSubmission = true;

    if (this.validForm()) {

      let formClean = this.raceBasicsForm.value as RaceBasicsForm;
      formClean.raceType = this.raceType;
      if (this.bannerURL) formClean.raceImage = this.bannerURL;
      formClean.public = false; 
      console.log('FORM DATA TO SEND: ', formClean)
      
      this.raceService.createRace(formClean).then((resp:FromResp) => {
        console.log('CREATE RESP:',resp);
        
        this.createSuccess = true;
        this.createResponse = resp;

        this.bannerURL = null;
        this.raceBasicsForm.reset();
        this.raceBasicsForm.markAsPristine();
        this.raceBasicsForm.markAsUntouched();
        this.initializeRaceBasicsForm();
      }).catch(error=>{
        console.error(error);
      }).finally(()=>{
        this.verifyingFormSubmission = false;
        this.hasSubmitted = false;
      });
    } else {
      // validate all form fields
      this.verifyingFormSubmission = false;
      this.hasSubmitted = false;
      Object.keys(this.raceBasicsForm.controls).forEach(field => {
        const control = this.raceBasicsForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

}

// --- All Race Form Interfaces ---
interface RaceBasicsForm {
  name: string,         // The race's name. Required, maxLength = 30
  description: string,  // The race's description. Required, maxLength = 2,000   UNKNOWN IF IMPLEMENTED IN BACKEND
  startDate:string,     // The race's starting date. Required
  endDate:string,       // The race's ending date. Required
  raceImage:any,        // The race's image file. NOT required
  raceType:RaceTypes,   // The race's type. Required
  public:Boolean,       // Is the race public/viewable? Initially always FALSE

  startLoc:string,      // Shouldn't be here...
  endLoc:string,        // Shouldn't be here...
  start_lon:number,     // Shouldn't be here...
  start_lat:number,     // Shouldn't be here...
  end_lon:number,       // Shouldn't be here...
  end_lat:number,       // Shouldn't be here...
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
