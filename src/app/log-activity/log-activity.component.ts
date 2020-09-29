import { Component, OnInit, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { ModalService } from '../modalServices';
import { StravauthService } from '../stravauth/stravauth.service';

@Component({
  selector: 'app-log-activity',
  templateUrl: './log-activity.component.html',
  styleUrls: ['./log-activity.component.css']
})
export class LogActivityComponent implements OnInit {
  @Input() id: string;

  modalData: any;
  private currentScreen = 'strava';
  private acceptedScreens = ['strava','manual'];
  public stravaData: StravaData;

  constructor(private modalService: ModalService,private _stravauthService: StravauthService) { }

  ngOnInit() {
  	console.log("hi", this.d);

    this._stravauthService.getStravaInfo().then( data => {
      this.stravaData = data as StravaData;
    })

  }

  SwitchSlideshow = (to:string = null) => {
    //console.log("to", to, this.acceptedScreens.indexOf(to));
    if (to == null || this.acceptedScreens.indexOf(to) == -1) return;
    this.currentScreen = to;
    return;
  }

  get d() { return this.modalService.modalsData[this.id]}

  closeDialog() {
    if (this.id == null) return;
    
   // this.modalService.callbackModal(this.id,'FROM CHILD');
    this.modalService.close(this.id);
  }


  uploadManualEntry(entry:any) {
  	console.log("FROM CHILD entry uploadManualEntry",{type:"manual",entry:entry});
  	this.modalService.callbackModal(this.id,{type:"manual",entry:entry});
    
  }

  setLoaderState(entry:any) {
    console.log("FROM CHILD entry setLoaderState",entry);
    this.modalService.callbackModal(this.id,{type:"strava",entry:entry});
    
  }

  refreshStatComponents(entry:any) {
    console.log("FROM CHILD entry refreshStatComponents",entry);
    this.modalService.callbackModal(this.id,{type:"strava",entry:entry});
    
  }

  submit()
  {

  }

}

interface StravaData{
  authorized: boolean;
  ID: number;
}
