import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {
  private reportForm: FormGroup;
  private storyID: number;
  public reportSuccess: boolean = false;

  offencesList = [
    { type: 'Nudity', selected: false, id: 1 },
    { type: 'Violence', selected: false, id: 2 },
    { type: 'Harassment', selected: false, id: 3 },
    { type: 'Suicide or self-injury', selected: false, id: 4 },
    { type: 'Spam', selected: false, id: 5 },
    { type: 'Fake News', selected: false, id: 6 },
    { type: 'Hate Speech', selected: false, id: 7 },
    { type: 'Other', selected: false, id: 8 },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private _storyService: StoryService,
    public dialogRef: MatDialogRef<ReportFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.storyID = data.storyID;
  }

  ngOnInit() {

    this.reportForm = this.formBuilder.group({
      offences: new FormArray([], this.minMaxSelectedCheckboxes(1, 1))
    });

    this.addCheckboxes();
  }

  get offences() {
    return this.reportForm.controls.offences as FormArray;
  };

  private addCheckboxes() {
    this.offencesList.forEach(() => this.offences.push(new FormControl(false)));
  }

  public minMaxSelectedCheckboxes(min = 1, max = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map(control => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => next ? prev + next : prev, 0);
  
      // if the total is not greater than the minimum, return the error message
      return (totalSelected >= min && totalSelected <= max) ? null : { required: true };
    };
  
    return validator;
  }

  submit(formValue: any){
    var selectedID: number;

    formValue.offences.forEach((offence, index) => {
      if (offence){
        selectedID = this.offencesList[index]['id'];
      }
    });
    
    this._storyService.reportStory(this.storyID, selectedID).then(() => {
      this.reportSuccess = true;
    })
  }

}
