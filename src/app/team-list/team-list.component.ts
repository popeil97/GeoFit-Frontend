import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar'
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatDialog } from '@angular/material';
import { TeamFormDialogComponent } from '../team-form/team-form-dialog.component';
import { TeamForm } from '../team-form/team-form.component';
import { TeamEditBody } from '../race-view-page/race-view-page.component';

import { 
  TeamService,
  NotificationsService,
} from '../services';
import {
  NotificationType,
} from '../models';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  teams:any[] = [];
  usersTeam:any;
  @Input() race_id:number;
  @Input() userStat:any;
  @Output() callback:EventEmitter<any> = new EventEmitter();
  @Output() edit:EventEmitter<any> = new EventEmitter();

  constructor(
    private _notificationService:NotificationsService,
    private _teamService:TeamService,
    private _snackbar:MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getTeams();
  }

  getTeams(): void {
    this._teamService.getTeamsList(this.race_id).then((resp) => {
      this.teams = resp['team_stats'];
      console.log('TEAMS COMPONENT:',this.teams);
      this.usersTeam = this.teams.find((team:any) => {
        return team.team_id == this.userStat.team_id;
      });

      console.log('MY TEAM:',this.usersTeam);
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

  openTeamForm() {
    let dialogPayload = {
      data: {
        editConfig:{
          team_id: this.userStat.team_id,
          isEdit: true ? this.userStat.team_id : false
        } as TeamEditBody,
        raceID: this.race_id
      }
    }
    let dialogRef = this.dialog.open(TeamFormDialogComponent,dialogPayload);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if(result != undefined && result == true) {
        // refresh team list component
        this.callback.emit();
        this.getTeams();
      }
    });
  }

}


