import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-race-settings',
  templateUrl: './race-settings.component.html',
  styleUrls: ['./race-settings.component.css']
})
export class RaceSettingsComponent implements AfterViewInit,OnChanges {
  @Input() userSettings:UserSettings = {} as UserSettings;
  settingsForm:FormGroup;
  private successfulUpdate:Boolean = false;

  constructor(private _usersService:UsersService) { 

    this.settingsForm = new FormGroup({
      isAutomaticImport: new FormControl('',[
        Validators.required,
      ])
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

    }
  }

  initForm(): void {
    console.log('value:',this.userSettings.isAutomaticImport);
    this.settingsForm = new FormGroup({
      isAutomaticImport: new FormControl(this.userSettings.isAutomaticImport,[
        Validators.required,
      ])
    });
    console.log('form value:',this.settingsForm);
  }

}

interface UserSettings {
  isAutomaticImport:Boolean;
  race_id:number;
}
