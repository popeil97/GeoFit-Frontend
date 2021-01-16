import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter,
  OnChanges,
  Inject,
  NgModule,
} from '@angular/core';
import { ModalService } from '../modalServices';
import { StravauthService } from '../stravauth/stravauth.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-log-activity',
  templateUrl: './log-activity.component.html',
  styleUrls: ['./log-activity.component.css']
})
export class LogActivityComponent implements OnInit {
  @Input() id: string;

  modalData: any;
  public currentScreen = 'strava';
  private acceptedScreens = ['strava','manual'];
  public stravaData: StravaData;

  constructor(
    private modalService: ModalService,
    private _stravauthService: StravauthService,
  
    private dialogRef : MatDialogRef<LogActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit() {
  	// console.log("hi", this.d);

    try{
      document.getElementById('strava-btn').style.backgroundColor = "#36343c";
      document.getElementById('strava-btn').style.color = "#FFFFFF";
    }
    catch(e)
    {
      
    }
    

    // this._stravauthService.getStravaInfo().then( data => {
    //   this.stravaData = data as StravaData;
    // })

  }

  SwitchSlideshow = (to:string = null) => {
    //console.log("to", to, this.acceptedScreens.indexOf(to));
    if (to == null || this.acceptedScreens.indexOf(to) == -1) return;
    this.currentScreen = to;

    document.getElementById(to+'-btn').style.backgroundColor = "#36343c";
    document.getElementById(to+'-btn').style.color = "#FFFFFF";

    switch(to) { 
     case 'strava': { 
       document.getElementById('manual-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('manual-btn').style.color = "#000000";
        break; 
     } 
     case 'manual': { 
       document.getElementById('strava-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('strava-btn').style.color = "#000000";
        break; 
     }  
     default: { 
        break; 
     } 
   }
    return;
  }

  get d() { 
    return this.data;
    //return this.modalService.modalsData[this.id]
  }

  closeDialog = () => {
    /*
    if (this.id == null) return;
    
   // this.modalService.callbackModal(this.id,'FROM CHILD');
    this.modalService.close(this.id);
    */
   this.dialogRef.close();
  }


  uploadManualEntry(entry:any) {
  	console.log("FROM CHILD entry uploadManualEntry",{type:"manual",entry:entry});
  	//this.modalService.callbackModal(this.id,{type:"manual",entry:entry});
    this.data.uploadActivity({type:"manual",entry:entry});
  }

  setLoaderState(entry:any) {
    console.log("FROM CHILD entry setLoaderState",entry);
    //this.modalService.callbackModal(this.id,{type:"strava",entry:entry});
    this.data.uploadActivity({type:"strava",entry:entry});
  }

  refreshStatComponents(entry:any) {
    console.log("FROM CHILD entry refreshStatComponents",entry);
    //this.modalService.callbackModal(this.id,{type:"strava",entry:entry});
    this.data.uploadActivity({type:"strava",entry:entry});
  }

  submit()
  {

  }

  

}

interface StravaData{
  authorized: boolean;
  ID: number;
}
