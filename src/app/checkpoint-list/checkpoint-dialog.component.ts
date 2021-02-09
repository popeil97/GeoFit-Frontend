import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';

@Component({
    selector: 'app-checkpoint-dialog',
    templateUrl: './checkpoint-dialog.component.html',
    styleUrls: ['./checkpoint-dialog.component.css']
  })

export class CheckpointDialogComponent implements OnInit {

    checkpointIDs: number[];

    constructor(public dialogRef: MatDialogRef<CheckpointDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          this.checkpointIDs = data.checkpointIDs;
         }



    ngOnInit(): void {
        
    }

}