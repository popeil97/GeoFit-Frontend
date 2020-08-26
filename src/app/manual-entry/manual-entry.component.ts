import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.css']
})
export class ManualEntryComponent implements OnInit {

  manualEntryForm:FormGroup;
  @Output() uploadManualEntry: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.manualEntryForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      distance: new FormControl('',[
        Validators.required
      ]),
      distanceType: new FormControl('',[
        Validators.required
      ]),
      hours: new FormControl(0,[
        Validators.required
      ]),
      minutes: new FormControl(0,[
        Validators.required
      ]),
      seconds: new FormControl(0,[
        Validators.required
      ])
    });

    this.manualEntryForm.get('distanceType').setValue('MI');
  }

  upload(): void {
    
    let formClean = this.manualEntryForm.value as any;
    console.log(this.manualEntryForm);
    let isValid: Boolean = this.manualEntryForm.valid;

    if(isValid) {
      formClean.distanceType = DistanceType[formClean.distanceType];

      this.manualEntryForm.reset();

      this.uploadManualEntry.emit(formClean);
    }
    this.manualEntryForm.get('distanceType').setValue('MI');
    this.manualEntryForm.get('hours').setValue(0);
    this.manualEntryForm.get('minutes').setValue(0);
    this.manualEntryForm.get('seconds').setValue(0);
  }

  parseDistanceType(entry:any) {
    console.log('VALUE:',entry.value);
    let value = entry.value;
    this.manualEntryForm.get('distanceType').setValue(DistanceType[value])
  }

}

export enum DistanceType {
  MI=1,
  KM=2
}
