import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { 
  ActivitiesService,
} from '../services';
import {
  ActivityItem
} from '../interfaces';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  @Input() activityData: ActivityItem;
  @Output() activityDeleted: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private _activityService: ActivitiesService,
  ) { }

  ngOnInit() {
  }

  //TODO: Extend functionality to delete multiple activities at once
  public removeActivityByID(activity_id:number){
    this._activityService.removeAppliedActivity(activity_id).then((data) => {
      if (data['success']){
        console.log("Successfully deleted activity!");
        this.activityDeleted.emit(activity_id);
        console.log("Emitted activityDeleted event from activity list");
      }
      else {
        console.log("Failed to delete activity.");
      }
    });
  }

}
