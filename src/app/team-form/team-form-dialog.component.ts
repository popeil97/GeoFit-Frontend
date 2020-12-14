import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { TeamForm } from './team-form.component';
import { TeamEditBody } from '../race-view-page/race-view-page.component';

@Component({
  selector: 'app-team-form-dialog',
  templateUrl: './team-form-dialog.component.html',
  styleUrls: ['./team-form-dialog.component.css']
})

export class TeamFormDialogComponent implements OnInit {

    editConfig:TeamEditBody;
    raceID:number;

    constructor(public dialogRef: MatDialogRef<TeamFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          this.editConfig = data.editConfig;
          this.raceID = data.raceID;
         }

    ngOnInit() {
    }

    formCallback() {
        console.log('GONNA CLOSE TEAM FORM MODAL');
        this.dialogRef.close(true);
    }



}
