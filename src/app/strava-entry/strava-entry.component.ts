import { Component, OnInit, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { ActivitiesService } from '../activities.service';


@Component({
  selector: 'app-strava-entry',
  templateUrl: './strava-entry.component.html',
  styleUrls: ['./strava-entry.component.css']
})
export class StravaEntryComponent implements OnInit {

  activities:Activity[] = [];
  public actsToImport:number[] = [];
  @Input() race_id:number;
  @Input() distance_unit:string;
  @Output() setLoaderState: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshStatComponents: EventEmitter<void> = new EventEmitter();
  
  columns:string[] = ['Name','Distance','Date'];
  selectedRows:number[] = [];
  invalidImport:Boolean = false;


  constructor(private _activitiesService:ActivitiesService) { }

  ngOnInit() {

    // this.addAct.emit({id:2} as any);
    // call activity service to get activities

    this.getActivities();


  }

  // add(act:Activity): void {
  //   this.addAct.emit(act);
  // }

  // importSelectedActs(): void {
  //   this.importActs.emit();
  // }

  importSelectedActs(): void {
    // this.loading = true; // switch to toggleFunction that communicates with parent
    this.invalidImport = false
    this.setLoaderState.emit(true);
    this._activitiesService.importActivities(this.actsToImport,this.race_id).then((res) => {
      if(!res['success']) {
        this.invalidImport = true;
      }
      console.log('IMPORT RESP:',res);
      this.actsToImport = [];
      this.setLoaderState.emit(false);
      // this.getRaceState(); // change eventually
      this.getActivities();
      this.refreshStatComponents.emit();
    });
  }

  addAct(act:any): void {
    let actID = act.id;
    let index = this.actsToImport.indexOf(actID);
    if(index >= 0) {
      this.actsToImport.splice(index,1);
    }
    else {
      this.actsToImport.push(actID);
    }
  }

  highlight(row:any): void {
    let index = this.selectedRows.indexOf(row.id);
    if(index >= 0) {
      this.selectedRows.splice(index,1);
    }
    else {
      this.selectedRows.push(row.id);
    }

//    console.log(this.selectedRows);
  }

  getActivities() {
    this._activitiesService.getActivities(this.race_id).then((resp) => {
      this.activities = resp['activities'];
      console.log("ACTIVITIES", this.activities);
    });
  }



}

export interface Activity {
  name:string,
  converted_dist:number,
  start_date:string
}