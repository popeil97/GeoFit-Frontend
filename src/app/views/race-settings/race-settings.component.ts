import { Component, OnInit, Input } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-race-settings',
  templateUrl: './race-settings.component.html',
  styleUrls: ['./race-settings.component.css']
})
export class RaceSettingsComponent implements OnInit {

  @Input() raceID:number;
  @Input() raceData:any = null;

  public form:FormGroup;

  constructor() { 
    this.initializeForm();
  }

  ngOnInit() {

  }

  initializeForm() {
    this.form = new FormGroup({
      teams:new FormControl(false),
      teamSize:new FormControl(5,[
        numberGreaterThan(0),
      ]),
      manual:new FormControl(false),
    });
  }
}

interface SettingsForm {
  teams:Boolean,
  teamSize:number,
  manual:Boolean,
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