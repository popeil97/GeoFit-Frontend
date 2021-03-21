import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';

import { 
  RaceService,

  TucanValidators,
} from '../../../services'

@Component({
  selector: 'app-race-settings',
  templateUrl: './race-settings.component.html',
  styleUrls: [
    './race-settings.component.css',
    '../../../../styles/forms.css',
  ]
})
export class RaceSettingsComponent implements OnInit,AfterViewInit {

  @Input() raceID:number;
  @Input() raceData:any = null;
  @Input() loadedCallback: (ref:any) => void;
  @Input() getRaceDataCallback: (callback:any) => void;

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
  ) {}

  ngOnInit() {
    this.initializeForm();
  }
  ngAfterViewInit() {
    this.loadedCallback(this);
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
          TucanValidators.isNumber(),
          Validators.min(1)
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
  }
  formValid = () => {
    return TucanValidators.isFormValid(this.form);
  }
  resetForm() {
    this.initializeForm();
    this.changedValues = [];
  }
  onFormSubmit() {
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
    this.validForm = this.formValid();

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
      this._raceService.updateOrCreateRaceSettings(this.raceID,formClean).then((resp)=>{
        this.updateSuccess = true;
        this.getRaceDataCallback(()=>{
          alert("Your Race Settings have been successfully updated");
          this.initializeForm();
        });
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