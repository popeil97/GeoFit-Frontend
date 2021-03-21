import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  Choice
} from '../../models';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: [
    './confirmation-popup.component.css',
    '../../../styles/forms.css',
  ]
})
export class ConfirmationPopupComponent implements OnInit {

  private header:string = null;
  private prompt:string = null;
  private choices:Array<Choice> = [];

  constructor(
    private dialogRef:MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any,
  ) { }

  ngOnInit() {
    // imported data must follow these conventions:
    // {
    //    header:string,
    //    prompt:string,
    //    choices:Array<Choice>
    // }
    this.header = this.data.confirmationData.header;
    this.prompt = this.data.confirmationData.prompt;
    this.choices = this.data.confirmationData.choices.map(choice=>{
      const c = {
        text:choice.text,
        value:choice.value,
        buttonColor:(choice.buttonColor)?choice.buttonColor:"white",
        textColor:(choice.textColor)?choice.textColor:"initial",
      } as Choice
      return c;
    });
  }

  closeDialog = (value:any) => {
    this.dialogRef.close({
      value:value,
      passedData:this.data.passedData,
    });
  }

}