import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { 
  UsersService 
} from '../services';
import { RaceViewPageComponent } from '../race-view-page/race-view-page.component';
import { ModalService } from '../modalServices';


@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.css']
})
export class MapSettingsComponent implements OnInit,OnChanges,OnDestroy {

  @Input() id: string;
  modalData: any;
  settingsForm:FormGroup;
  successfulUpdate:Boolean = false;

  ageRangeOptions: any[];

  private onChangesSubscriptions:any[] = [];

  constructor(
    private _usersService:UsersService,
    private modalService: ModalService
  ) {
    //, private _raceview:RaceViewPageComponent

    this.settingsForm = new FormGroup({
      isAutomaticImport: new FormControl('',[
        Validators.required, 
      ]),
      heatMapOn: new FormControl('',[
        Validators.required,
      ]),
      followerPinsOnly: new FormControl(false, [
        Validators.required,
      ]),
      malePinsOn: new FormControl(true, [
        Validators.required,
      ]),
      femalePinsOn: new FormControl(true, [
        Validators.required,
      ]),
      allAgesOn: new FormControl(true, [
        Validators.required,
      ]),
      ageRange: new FormControl(-1),
      showOrgPins: new FormControl(false, [
        Validators.required,
      ]),
    });
    this.ageRangeOptions = ['0-19', '20-34', '35-49', '50-64', '65-79', '80-'];
  }


  ngOnChanges(changes: SimpleChanges): void {

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'userSettings':
          //   console.log('SETTINGS CHANGED');
            if(changes.userSettings.currentValue != undefined) {
              this.initForm();
            }
        }
      }
    }

    console.log("ON CHANGES");

    let allAgesOnSubscription = this.settingsForm.get('allAgesOn').valueChanges
      .subscribe(value => {
          if (value == true) {
            this.settingsForm.get('ageRange').disable();
          }
          else {
            this.settingsForm.get('ageRange').enable();
          }
      });

    let showOrgPinsSubscription = this.settingsForm.get('showOrgPins').valueChanges
      .subscribe(value => {
        if (value == true) {
          this.settingsForm.get('ageRange').disable();
          this.settingsForm.get('allAgesOn').disable();
          this.settingsForm.get('femalePinsOn').disable();
          this.settingsForm.get('malePinsOn').disable();
          this.settingsForm.get('followerPinsOnly').disable();
        }
        else {
          this.settingsForm.get('ageRange').enable();
          this.settingsForm.get('allAgesOn').enable();
          this.settingsForm.get('femalePinsOn').enable();
          this.settingsForm.get('malePinsOn').enable();
          this.settingsForm.get('followerPinsOnly').enable();
        }
      });
    
      this.onChangesSubscriptions.push(allAgesOnSubscription, showOrgPinsSubscription);
  }
  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy() {
    if (this.onChangesSubscriptions.length > 0) {
      this.onChangesSubscriptions.forEach(subscription=>{
        subscription.unsubscribe();
      });
    }
    this.onChangesSubscriptions = [];
  }

  get d() { return this.modalService.modalsData[this.id]}

  closeDialog() {
    if (this.id == null) return;
    this.modalService.close(this.id);
  }

  apply(): void {
    console.log("APPLY!");
    let formClean = this.settingsForm.value as UserSettings;
    console.log(this.settingsForm);
    let isValid: Boolean = this.settingsForm.valid;
    console.log("isValid",isValid);
    if(isValid) {
      
      formClean.race_id = this.d.userSettings.race_id;

      console.log('clean:',formClean);

      this._usersService.updateUserRaceSetting(formClean).then((resp) => {
        console.log('SETTINGS UPDATE:',resp);
        this.successfulUpdate = true;
      });

      let pinSettings = this.settingsForm.value as PinSettings;

      if (!this.settingsForm.value.allAgesOn && !this.settingsForm.get('ageRange').disabled){
        let ages = this.settingsForm.value.ageRange.split("-");

        pinSettings.minAge = ages[0];
        
        if (ages.length == 2){
          pinSettings.maxAge = ages[1];
        }
        else{
          //Sorry to everybody in the race aged 1000 and older
          pinSettings.maxAge = 1000;
        }
      }

    console.log("FROM CHILD map-settings", pinSettings);
    this.modalService.callbackModal(this.id,{type:"map",pinSettings:pinSettings});

      //this._raceview.showPinsFromSettings(pinSettings);

    }
  }

  initForm(): void {
  //  console.log("INIT!");
   //  console.log('Automatic import value:',this.userSettings.isAutomaticImport);
   //  console.log('Heatmap value:',this.userSettings.heatMapOn);
   //his.d.userSettings.isAutomaticImport,
    this.settingsForm = new FormGroup({
      isAutomaticImport: new FormControl(false,[
        Validators.required,
      ]),
      heatMapOn: new FormControl(false,[
        Validators.required,
      ]),
      followerPinsOnly: new FormControl(false, [
        Validators.required,
      ]),
      malePinsOn: new FormControl(true, [
        Validators.required,
      ]),
      femalePinsOn: new FormControl(true, [
        Validators.required,
      ]),
      allAgesOn: new FormControl(true, [
        Validators.required,
      ]),
      ageRange: new FormControl(-1),
      showOrgPins: new FormControl(false, [
        Validators.required,
      ]),
    });
    console.log("INIT!",this.settingsForm);
    //Disable age control by default
    this.settingsForm.get('ageRange').enable();

  //   console.log('form value:',this.settingsForm);
  }

}

interface UserSettings {
  isAutomaticImport:Boolean;
  heatMapOn:Boolean;
  race_id:number;
}

interface PinSettings {
  followerPinsOnly: boolean;
  malePinsOn: boolean;
  femalePinsOn: boolean;
  allAgesOn: boolean;
  minAge: number;
  maxAge: number;
  showOrgPins: boolean;
}