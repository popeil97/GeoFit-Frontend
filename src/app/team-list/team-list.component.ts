import { Component, OnInit, Input } from '@angular/core';
import { NotificationType, NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  @Input() teams:any[] = [];

  constructor(private _notificationService:NotificationsService) { }

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

}
