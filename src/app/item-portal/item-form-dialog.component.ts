import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-item-form-dialog',
  templateUrl: './item-form-dialog.component.html',
  styleUrls: ['./item-form-dialog.component.css']
})

export class ItemFormDialogComponent implements OnInit {

    itemID:number;
    raceID:number;

    constructor(public dialogRef: MatDialogRef<ItemFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          this.itemID = data.itemID;
          this.raceID = data.raceID;
         }

    ngOnInit() {
    }

    formCallback() {
        console.log('GONNA CLOSE TEAM FORM MODAL');
        this.dialogRef.close(true);
    }



}