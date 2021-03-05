import { Component, OnInit, Input } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';

import { RaceService } from '../../race.service';

@Component({
  selector: 'app-race-settings',
  templateUrl: './race-settings.component.html',
  styleUrls: ['./race-settings.component.css']
})
export class RaceSettingsComponent implements OnInit {

  @Input() raceID:number;
  @Input() raceData:any = null;
  @Input() getRaceDataCallback: () => void;

  public form:FormGroup;
  public loading:Boolean = true;
  public changedValues = [];
  public hasSubmitted:Boolean = false;
  public checkingValidityOfSubmission = false;
  public validForm:Boolean = false;
  public updatingSettings:Boolean = false;
  public updateSuccess:Boolean = false;

  constructor(
    private _raceService:RaceService,
  ) { 
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.loading = true;

    this.form = new FormGroup({
      allow_teams:new FormControl(this.raceData.allow_teams),
      max_team_size:new FormControl(
        {
          value:this.raceData.max_team_size,
          disabled:!this.raceData.allow_teams
        },
        [
          isNumber(),
          numberGreaterThan(0),
        ]
      ),
      is_manual_entry:new FormControl(this.raceData.is_manual_entry),
    });
    this.loading = false;
  }
  valueChange(key:string) {
    let changed = false;
    if (this.form.get(key).value != this.raceData[key]) {
      if (this.changedValues.indexOf(key) == -1) this.changedValues.push(key);
      changed = true;
    }
    else {
      let index = this.changedValues.indexOf(key);
      if (index > -1) this.changedValues.splice(index, 1);
    }

    if (key=="allow_teams") {
      if (this.form.get(key).value) {
        this.form.get('max_team_size').enable();
        if (this.form.get('max_team_size').value != this.raceData.max_team_size) {
          if (this.changedValues.indexOf('max_team_size') == -1) this.changedValues.push('max_team_size');
          changed = true;
        }
        else {
          let index = this.changedValues.indexOf('max_team_size');
          if (index > -1) this.changedValues.splice(index, 1);
        }
      }
      else {
        this.form.get('max_team_size').disable();
        let index = this.changedValues.indexOf('max_team_size');
        if (index > -1) this.changedValues.splice(index, 1);
      }
    }

    console.log('VALUE CHANGES:',this.changedValues,key,changed);
  }
  resetForm() {
    this.initializeForm();
    this.changedValues = [];
  }
  onFormSubmit() {

    const isFormValid = (f:FormGroup) => { 
      return f.disabled ? f.errors == null : f.valid;
    }
    const getCorrespondingKey = (k:string) => {
      let c = null;
      switch(k) {
        case 'allow_teams':
          c = 'allowTeams';
          break;
        case 'max_team_size':
          c = 'maxTeamSize';
          break;
        case 'is_manual_entry':
          c = "isManual";
          break;
      }
      return c;
    }

    // Have to disable all form inputs

    this.checkingValidityOfSubmission = true;
    this.hasSubmitted = true;
    this.updatingSettings = false;
    this.updateSuccess = false;
    this.validForm = isFormValid(this.form);

    this.form.get('allow_teams').disable();
    this.form.get('max_team_size').disable();
    this.form.get('is_manual_entry').disable();

    if (this.validForm && this.changedValues.length > 0) {
      // VALID FORM!
      var formClean = {};
      this.changedValues.forEach(key=>{
        let corKey = getCorrespondingKey(key);
        if (corKey) {
          formClean[corKey] = this.form.get(key).value;
        }
      });

      this.updatingSettings = true;
      this._raceService.updateOrCreateRaceSettings(this.raceID,formClean).then(()=>{
        this.updateSuccess = true;
        alert("Your Race Settings have been successfully updated");
        this.getRaceDataCallback();
        this.initializeForm();
      }).catch(error=>{
        alert(error);
      }).finally(()=>{
        this.updatingSettings = false;
        this.checkingValidityOfSubmission = false;
        this.form.get('allow_teams').enable();
        if (this.form.get('allow_teams').value) this.form.get('max_team_size').enable();
        else this.form.get('max_team_size').disable();
        this.form.get('is_manual_entry').enable();
      })
    } else {
      this.checkingValidityOfSubmission = false;
      this.form.get('allow_teams').enable();
      if (this.form.get('allow_teams').value) this.form.get('max_team_size').enable();
      else this.form.get('max_team_size').disable();
      this.form.get('is_manual_entry').enable();
    }
  }
}

export function isNumber() {
  return function (control:FormControl) {
    const val = control.value;
    if (
      !isNaN(val) && 
      parseInt(val) == val && 
      !isNaN(parseInt(val, 10))
    ) return null;
    return {
      notNumber: true
    }
  }
}
export function numberGreaterThan( greaterThan:number ) {
  return function (control: FormControl) {
    const val = control.value;

    if (typeof val === 'undefined' || val == null) 
      return {
        missing:true,
      }
    if (typeof val !== 'number') 
      return {
        notNumber:true,
      }
    if (val <= greaterThan) 
      return {
        notGreaterThan:true
      }
    return null;
  };
}