import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-race-dashboard-racer-row',
  templateUrl: './race-dashboard-racer-row.component.html',
  styleUrls: ['./race-dashboard-racer-row.component.css']
})
export class RaceDashboardRacerRowComponent implements OnInit {
  @Input() racerData: RacerItem;

  @Output() removeUserByIDEvent: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public removeUserByID(user_id: number){
    this.removeUserByIDEvent.emit(user_id);
  }

}

interface RacerItem{
  profile_url:string;
  username:string;
  display_name:string;
  distance:number;
  distance_type:string;
  child_user_stats: RacerItem[];
  activities: any[];
  total_distance:any;
  isTeam:any;
}
