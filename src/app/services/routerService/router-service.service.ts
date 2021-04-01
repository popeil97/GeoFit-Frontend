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
} from '../../interfaces';

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

  hasFormChanged = ():Boolean => {
    return this.formChangesExist;
  }

  resetFormChange = ():void => {
    this.formHasChanged(false);
  }

  openConfirmationPopup = (callback:any, panelClass:string = "DialogDefaultContainer", confirmationData:ConfirmationData = this.formChangePopupData) => {
    this.dialog.open(ConfirmationPopupComponent,{
      panelClass:panelClass,
      data:{
        confirmationData:confirmationData,
      }
    }).afterClosed().subscribe(callback);
  }

  navigateTo(url:string, params:any = null, bypassConfirmation:Boolean = false) {
    const to = (params != null) ? [url,params] : [url]
    const reroute = ():void => {
      this.router.navigate(to);
      this.formHasChanged(false);
    }

    if (this.formChangesExist && !bypassConfirmation) {
      this.openConfirmationPopup((result:any)=>{
        if (result.value) reroute();
      });
    } 
    else reroute();
  }
}
