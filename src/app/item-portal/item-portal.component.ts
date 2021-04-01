import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material';
import { 
  RaceService,
  ItemService,
} from '../services';
import { ItemFormDialogComponent } from './item-form-dialog.component';
import { ItemListComponent } from './item-list.component';

@Component({
  selector: 'app-item-portal',
  templateUrl: './item-portal.component.html',
  styleUrls: ['./item-portal.component.css']
})
export class ItemPortalComponent implements OnInit {
  
  @ViewChildren(ItemListComponent) itemListChildren: QueryList<ItemListComponent>;
  @Input() raceID:number = 24;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {}

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

      this.refreshItemLists();
    });
  }

  refreshItemLists() {
    this.itemListChildren.toArray().forEach(itemListChild => {
      itemListChild.getItemList();
    });
  }

}
