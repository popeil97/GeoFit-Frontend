import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RaceService } from '../../../race.service';
import { Router } from '@angular/router';

import { cannotBeEmptyString, requiredFileType } from '../race-dashboard.component';

@Component({
  selector: 'app-race-basics',
  templateUrl: './race-basics.component.html',
  styleUrls: [
    './race-basics.component.css',
    '../../../../styles/forms.css'
  ]
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