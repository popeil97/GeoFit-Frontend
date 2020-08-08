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
    });
    
  }
  ngOnChanges(changes: SimpleChanges): void {

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'userSettings':
            console.log('SETTINGS CHANGED');
            if(changes.userSettings.currentValue != undefined) {
              this.initForm();
            }
        }
      }
    }
    
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

      // if(this.settingsForm.value.heatMapOn == true)
      // {
      //   this._raceview.createUserHeatPins();
      // }
      // else
      // {
      //   this._raceview.createUserPins();
      // }

      let all = !this.settingsForm.value.followerPinsOnly && this.settingsForm.value.malePinsOn && this.settingsForm.value.femalePinsOn;
      this._raceview.showPinsFromSettings(all, this.settingsForm.value.followerPinsOnly, this.settingsForm.value.malePinsOn, this.settingsForm.value.femalePinsOn);

    }
  }

  initForm(): void {
    console.log('Automatic import value:',this.userSettings.isAutomaticImport);
    console.log('Heatmap value:',this.userSettings.heatMapOn);
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
    });
    console.log('form value:',this.settingsForm);
  }

}

interface UserSettings {
  isAutomaticImport:Boolean;
  heatMapOn:Boolean;
  followerPinsOnly:Boolean;
  race_id:number;
}
