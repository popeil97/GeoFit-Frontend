import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { MapComponent } from '../../map/map.component';
import { RaceService } from '../../race.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';
import { LoginComponent } from '../../login/login.component';
import { Register2Component } from '../../register2/register2.component';

@Component({
  selector: 'app-race-create',
  templateUrl: './race-create.component.html',
  styleUrls: ['./race-create.component.css']
})
export class RaceCreateComponent implements OnInit {

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
    public verifyingFormSubmission:boolean = false;
    public createSuccess: boolean = false;
    public createResponse: any = null;

  raceMerchandiseForm:FormGroup;

  loading:Boolean = false;

  constructor(
    private _raceService:RaceService,
    private _authService:AuthService,
    private router:Router,
    private dialog:MatDialog,
  ) { 
    this.initializeRaceBasicsForm();
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
  selectRaceTypeEvent(option_name:string) {
    this.raceType = this.raceTypeOptionDictionary[option_name];
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

    if (this.raceBasicsForm.valid) {

      let formClean = this.raceBasicsForm.value as RaceBasicsForm;
      formClean.raceType = this.raceType;
      if (this.bannerURL) formClean.raceImage = this.bannerURL;
      formClean.public = false; 
      console.log('FORM DATA TO SEND: ', formClean)
      
      this._raceService.createRace(formClean).then((resp:FromResp) => {
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


export interface MapBoxCoord {
  lon:number;
  lat:number;
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


export function cannotBeEmptyString() {
  return function (control: FormControl) {
    const val = control.value;
    const valid = (typeof val === "string" && val.trim().length > 0);
    if (!valid) {
      return {
        required:true
      }
    }
    return null;
  }
}
export function requiredFileType( required:boolean, types: Array<string> ) {
  return function (control: FormControl) {

    const file = control.value;
    
    if ( file ) {
      const filename_components = file.split('.');
      const extension = filename_components[filename_components.length - 1].toLowerCase();
      console.log(extension);
      if ( types.indexOf(extension) > -1 ) {
        console.log('extension allowed');
        return null;
      }
      console.log('extension not allowed');
      return {
        requiredFileType: true
      }
    }

    if (required) {
      console.log('file is still required anyways');
      return {
        requiredFileType: true
      };
    }

    return null;
  };
}