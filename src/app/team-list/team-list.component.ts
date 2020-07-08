import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationType, NotificationsService } from '../notifications.service';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  @Input() teams:any[] = [];
  @Input() userStat:any;
  @Output() callback:EventEmitter<any> = new EventEmitter();

  constructor(private _notificationService:NotificationsService,private _teamService:TeamService) { }

  ngOnInit() {
    console.log('TEAMS COMPONENT:',this.teams);
  }

  joinRequest(team:any): void {

    let form = {
      type:NotificationType.TEAM_JOIN,
      context_id:team.user_id,
    }

    this._notificationService.createNotification(form).then((resp) => {
      console.log('NOTIFICATION RESP:',resp);
    });
  }

  quitTeam(team:any): void {
    this._teamService.quitTeam(team.race_id,team.team_id).then((resp) => {
      console.log('RESP FROM TEAM QUIT',resp);
      this.callback.emit();
    });
  }

}
