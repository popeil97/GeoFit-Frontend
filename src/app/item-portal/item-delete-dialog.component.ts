import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-item-delete-dialog',
  templateUrl: './item-delete-dialog.component.html',
  styleUrls: ['./item-delete-dialog.component.css']
})

export class ItemDeleteDialogComponent implements OnInit {

    itemID:number;
    itemName:string;

    constructor(public dialogRef: MatDialogRef<ItemDeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          this.itemID = data.itemID;
          this.itemName = data.itemName;
         }

    ngOnInit() {
    }

    formCallback() {
        console.log('GONNA CLOSE TEAM FORM MODAL');
        this.dialogRef.close(true);
    }



}