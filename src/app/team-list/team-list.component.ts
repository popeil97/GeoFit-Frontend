import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationType, NotificationsService } from '../notifications.service';
import { TeamService } from '../team.service';
import {MatSnackBar} from '@angular/material/snack-bar'
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  teams:any[] = [];
  @Input() race_id:number;
  @Input() userStat:any;
  @Output() callback:EventEmitter<any> = new EventEmitter();
  @Output() edit:EventEmitter<any> = new EventEmitter();

  constructor(private _notificationService:NotificationsService,
              private _teamService:TeamService,
              private _snackbar:MatSnackBar) { }

  ngOnInit() {
    this.getTeams();
  }

  getTeams(): void {
    this._teamService.getTeamsList(this.race_id).then((resp) => {
      this.teams = resp['team_stats'];
     //  console.log('TEAMS COMPONENT:',this.teams);
    });
  }

  joinRequest(team:any): void {

 //    console.log('TEAM:',team);

    let form = {
      type:NotificationType.TEAM_JOIN,
      context_id:team.team_id,
    }

    this._notificationService.createNotification(form).then((resp) => {
    //   console.log('NOTIFICATION RESP:',resp);
      this._snackbar.openFromComponent(SnackbarComponent,{duration: 5000,horizontalPosition: 'center',
        verticalPosition: 'bottom',data:{message:"Request has been sent"}})
    });
  }

  quitTeam(team:any): void {
    this._teamService.quitTeam(team.race_id,team.team_id).then((resp) => {
   //    console.log('RESP FROM TEAM QUIT',resp);
      this.getTeams();
      this.callback.emit();
    });
  }

  editTeam(team:any) {
    this.edit.emit(team.team_id);
  }

}


