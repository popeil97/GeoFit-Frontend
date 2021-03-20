import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { 
  StoryService,
  TucanValidators,
} from '../../services';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: [
    './report-form.component.css',
    '../../../styles/forms.css'
  ]
})
export class ReportFormComponent implements OnInit,OnDestroy {

  private storyID: number;

  public reportForm:FormGroup = null;
  public initializing:Boolean = true;
  public checkingValidity:Boolean = false;
  public submitted:Boolean = false;
  public reportSuccess:Boolean = false;
  public reportError:any = null;

  public offencesList = [
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
    private fb: FormBuilder,
    private _storyService: StoryService,
    public dialogRef: MatDialogRef<ReportFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.storyID = data.storyID;
  }

  ngOnInit() {
    this.initializeForm();
  }
  ngOnDestroy() {
    this.reportForm = null;
  }

  initializeForm = () => {
    
    this.initializing = true;
    this.submitted = false;
    this.checkingValidity = false;

    /*
    this.reportForm = this.fb.group({
      offences: new FormArray([], this.minMaxSelectedCheckboxes(1, 1))
    })
    */

    this.reportForm = this.fb.group({
      offence:['',Validators.compose([
        Validators.required,
      ])]
    });
    this.initializing = false;
  }
  _isFormValid = ():Boolean => {
    return TucanValidators.isFormValid(this.reportForm);
  }
  onSubmit = (e:any) => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    this.checkingValidity = true;
    this.submitted = true;
    const valid = this._isFormValid();
    if (!valid) {
      this.checkingValidity = false;
      return;
    }
    const selectedID = this.reportForm.get('offence').value;
    this._storyService.reportStory(this.storyID, selectedID).then(() => {
      this.reportSuccess = true;
    }).catch(error=>{
      this.reportError = error;
    }).finally(()=>{
      this.checkingValidity = false;
    })
  }

/*  
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
  */

  closeDialog = () => {
    this.dialogRef.close();
  }

}
