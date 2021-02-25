import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ItemService } from '../item.service';
import { RaceService } from '../race.service';
import { ItemFormDialogComponent } from './item-form-dialog.component';

@Component({
  selector: 'app-item-portal',
  templateUrl: './item-portal.component.html',
  styleUrls: ['./item-portal.component.css']
})
export class ItemPortalComponent implements OnInit,OnChanges {
  
  @Input() raceID:number = 24;

  constructor(public dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit() {

  }

  openItemForm() {
    // launch item form dialog component
    let dialogPayload = {
      height: '700px',
      width: '600px',
      data: {
        itemID: null,
        raceID: this.raceID
      }
    }
    let dialogRef = this.dialog.open(ItemFormDialogComponent,dialogPayload);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if(result != undefined && result == true) {
        // refresh item list component
      }
    });
  }

}
