import { Component, OnInit, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { ModalService } from '../modalServices';
@Component({
  selector: 'app-log-activity',
  templateUrl: './log-activity.component.html',
  styleUrls: ['./log-activity.component.css']
})
export class LogActivityComponent implements OnInit {
  @Input() id: string;
  @Output() uploadManualEntry2: EventEmitter<any> = new EventEmitter();

  modalData: any;
  private currentScreen = 'strava';
  private acceptedScreens = ['strava','manual'];

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  	console.log("hi", this.d);

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
    this.modalService.close(this.id);
  }


  uploadManualEntry(entry:any) {
  	console.log(entry);
  	//this.uploadManualEntry2.emit(entry);
    
  }

  submit()
  {

  }

}
