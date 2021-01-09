import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';

export class CheckpointDialogComponent implements OnInit {

    raceID: number;
    checkpointIDs: number[];

    constructor(public dialogRef: MatDialogRef<CheckpointDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          this.checkpointIDs = data.checkpointIDs;
          this.raceID = data.raceID;
         }



    ngOnInit(): void {
        
    }

}