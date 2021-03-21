import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { 
  ConfirmationPopupComponent
} from '../../popups/confirmation-popup/confirmation-popup.component';
import {
  ConfirmationData,
  Choice,
} from '../../models';

@Injectable({
  providedIn: 'root'
})

export class RouterService {

  public formChangeEvent:Subject<Boolean> = new Subject<Boolean>();

  private formChangesExist:Boolean = false;
  private formChangePopupData:ConfirmationData = {
    header:"Warning",
    prompt:"You've made changes to this form. Do you wish to discard changes and continue?",
    choices:[
      {
        text:"Discard",
        value:true,
        buttonColor:"red",
        textColor:"white",
      } as Choice,
      {
        "text":"Cancel",
        value:false,
      } as Choice
    ]
  }

  constructor(
    private router:Router,
    private dialog:MatDialog,
  ) {
    this.formChangeEvent.subscribe((value:Boolean)=>{
      this.formChangesExist = value;
    });
  }

  formHasChanged = (value:Boolean) => {
    this.formChangeEvent.next(value);
  }

  navigateTo(url:string, params:any = null, bypassConfirmation:Boolean = false) {
    const to = (params != null) ? [url,params] : [url]
    if (this.formChangesExist && !bypassConfirmation) {
      this.dialog.open(ConfirmationPopupComponent,{
        panelClass:'DialogDefaultContainer',
        data:{
          confirmationData:this.formChangePopupData,
        }
      }).afterClosed().subscribe(result=>{
        if (result.value) {
          this.router.navigate(to);
          this.formHasChanged(false);
        }
      });
    } 
    else {
      this.router.navigate(to);
      this.formHasChanged(false);
    }
  }
}
