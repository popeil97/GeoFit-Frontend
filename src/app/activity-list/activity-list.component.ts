import { Component, OnInit, Input } from '@angular/core';
import { ActivitiesService } from '../activities.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  @Input() activityData: ActivityItem;

  constructor(
    private _activityService: ActivitiesService,
  ) { }

  ngOnInit() {
  }

  //TODO: Extend functionality to delete multiple activities at once
  public removeActivityByID(activity_id:number){
    this._activityService.removeAppliedActivity(activity_id).then((data) => {
      console.log(data);
    });
  }

}

interface ActivityItem {
  id:number;
  name:string;
  distance:number;
  distance_type:string;
  moving_time:number;
  start_date:string;
  type:string;
  is_manual:boolean;
}
