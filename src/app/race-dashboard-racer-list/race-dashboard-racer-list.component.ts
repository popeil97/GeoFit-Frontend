import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RaceDashboardService } from '../race-dashboard.service';

@Component({
  selector: 'app-race-dashboard-racer-list',
  templateUrl: './race-dashboard-racer-list.component.html',
  styleUrls: ['./race-dashboard-racer-list.component.css']
})
export class RaceDashboardRacerListComponent implements OnInit {
  @Input() raceID: number;
  @Input() raceName: string;

  //public columns:string[] = ['ProfilePic','Data','Distance','Actions'];
  //public dataSource: any;

  public racersList:RacerItem[];

  constructor(
    private _dashboardService: RaceDashboardService,
  ) { }


  ngOnInit() {
    if (this.raceID){
      this.getRaceList();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'raceID':
            if(this.raceID != undefined) {
              this.getRaceList();
            }
        }
      }
    }
  }

  private getRaceList(){
    console.log("getting racer list with ID: ", this.raceID);
    this._dashboardService.getRacerList(this.raceID).then((data) => {
      this.racersList = data as RacerItem[];
      console.log("Racers list: ", this.racersList);
    })
  }

  public removeUserByID(user_id:number){
    this._dashboardService.removeUserFromRaceByID(this.raceID, user_id).then((data) => {
      if (data['success']){
        console.log("Successfully removed user!");
        this.getRaceList();
      }
      else {
        console.log("Failed to remove user!");
      }
    })
  }

  public activityDeletedHandler(id: number){
    //TODO: Something smart that only refreshes activity
    //list that was affected by change
    console.log("In racer list handler", id);
    //this.getRaceList();
  }
  
}

interface RacerItem{
  profile_url:string;
  username:string;
  display_name:string;
  distance:number;
  distance_type:string;
  child_user_stats: RacerItem[];
  activities: ActivityItem[];
}

interface ActivityItem {
  id:number;
  name:string;
  distance:string;
  moving_time:number;
  start_date:string;
  type:string;
  is_manual:boolean;
}