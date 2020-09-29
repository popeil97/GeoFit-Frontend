import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { RaceViewComponent } from '../race-view/race-view.component';

@Component({
  selector: 'app-race-settings',
  templateUrl: './race-settings.component.html',
  styleUrls: ['./race-settings.component.css']
})
export class RaceSettingsComponent implements AfterViewInit,OnChanges {
  @Input() userSettings:UserSettings = {} as UserSettings;
  settingsForm:FormGroup;
  successfulUpdate:Boolean = false;

  ageRangeOptions: any[];

  constructor(private _usersService:UsersService, private _raceview:RaceViewComponent) { 

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

    this.settingsForm.get('allAgesOn').valueChanges
      .subscribe(value => {
          if (value == true) {
            this.settingsForm.get('ageRange').disable();
          }
          else {
            this.settingsForm.get('ageRange').enable();
          }
      });

    this.settingsForm.get('showOrgPins').valueChanges
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
      })
    
  }
  ngAfterViewInit(): void {
    
  }

  apply(): void {
    let formClean = this.settingsForm.value as UserSettings;
    console.log(this.settingsForm);
    let isValid: Boolean = this.settingsForm.valid;

    if(isValid) {
      
      formClean.race_id = this.userSettings.race_id;

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

      this._raceview.showPinsFromSettings(pinSettings);

    }
  }

  initForm(): void {
   //  console.log('Automatic import value:',this.userSettings.isAutomaticImport);
   //  console.log('Heatmap value:',this.userSettings.heatMapOn);
    this.settingsForm = new FormGroup({
      isAutomaticImport: new FormControl(this.userSettings.isAutomaticImport,[
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

    //Disable age control by default
    this.settingsForm.get('ageRange').disable();

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
