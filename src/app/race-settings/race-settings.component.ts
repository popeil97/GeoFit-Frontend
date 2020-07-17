import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { RaceViewComponent } from '../race-view/race-view.component';

@Component({
  selector: 'app-race-settings',
  templateUrl: './race-settings.component.html',
  styleUrls: ['./race-settings.component.css']
})
export class RaceSettingsComponent implements OnInit, AfterViewInit,OnChanges {
  @Input() userSettings:UserSettings = {} as UserSettings;

  settingsForm:FormGroup;
  private successfulUpdate:Boolean = false;

  constructor(private _usersService:UsersService, private _raceview:RaceViewComponent) { 

    this.settingsForm = new FormGroup({
      isAutomaticImport: new FormControl('',[
        Validators.required, 
      ]),
      heatMapOn: new FormControl('',[
        Validators.required, 
      ])
    });
    
  }

  ngOnInit() {}

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

        this._raceview.createUserPins();
        //if(resp.settings.heatMapOn == true)
        //{
        //  this._raceview.createUserHeatPins();
        //}
        //else
        //{
        //  this._raceview.createUserPins();
        //}

      });

      
    }
  }

  initForm(): void {
    console.log('automatic import value:',this.userSettings.isAutomaticImport);
    console.log('heatmap value:',this.userSettings.heatMapOn);
    this.settingsForm = new FormGroup({
      isAutomaticImport: new FormControl(this.userSettings.isAutomaticImport,[
        Validators.required,
      ]),
      heatMapOn: new FormControl('',[
        Validators.required, 
      ])
    });
    console.log('form value:',this.settingsForm);
  }

}

interface UserSettings {
  isAutomaticImport:Boolean;
  heatMapOn:Boolean;
  race_id:number;
}
