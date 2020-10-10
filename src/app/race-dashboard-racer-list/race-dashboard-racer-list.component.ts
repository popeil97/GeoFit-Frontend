import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RaceDashboardService } from '../race-dashboard.service';

@Component({
  selector: 'app-race-dashboard-racer-list',
  templateUrl: './race-dashboard-racer-list.component.html',
  styleUrls: ['./race-dashboard-racer-list.component.css']
})
export class RaceDashboardRacerListComponent implements OnInit {
  @Input() raceID: number;

  public columns:string[] = ['ProfilePic','Data','Distance','Actions'];
  public dataSource: any;

  public racersList:RacerItem[];

  constructor(
    private _dashboardService: RaceDashboardService,
  ) { }


  ngOnInit() {
    this.getRaceList();
  }

  ngOnChanges(changes: SimpleChanges): void {

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'raceID':
            if(changes.raceID.currentValue != undefined) {
              this.getRaceList();
            }
        }
      }
    }
  }

  private getRaceList(){
    this._dashboardService.getRacerList(this.raceID).then((data) => {
      this.racersList = data as RacerItem[];
      console.log("Racers list: ", this.racersList);
    })
  }

  public removeUserByID(user_id:number){
    console.log("Removing user id.. ", user_id)
    this._dashboardService.removeUserFromRaceByID(this.raceID, user_id).then((data) => {
      console.log(data);
      if (data['success']){
        console.log("Successfully removed user!");
        this.getRaceList();
      }
      else {
        console.log("Failed to remove user!");
      }
    })
  }

}

interface RacerItem{
  profile_url:string;
  username:string;
  display_name:string;
  distance:number;
  distance_type:string;
  child_user_stats: RacerItem[];
}
