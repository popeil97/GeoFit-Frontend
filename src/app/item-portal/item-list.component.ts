import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ItemDeleteDialogComponent } from './item-delete-dialog.component';
import { ItemFormDialogComponent } from './item-form-dialog.component';
import { 
  RaceService,
  ItemService,
} from '../services';
import { 
  Item, 
  ItemType 
} from '../models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  
  @Input() raceID:number;
  @Input() itemType:ItemType;
  @Output() refresh:EventEmitter<any> = new EventEmitter(); 

  public items:Item[];

  constructor(private _itemService:ItemService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getItemList();
  }

  getItemList() {
    this._itemService.getItemsByType(this.raceID,this.itemType).then((resp) => {
        this.items = resp['items'];
        console.log("ITEMS: ",this.items);
    });
  }

  deleteItem(item:Item) {
    let dialogPayload = {
        data: {
          itemID: item.id,
          itemName: item.name 
        }
      }
      let dialogRef = this.dialog.open(ItemDeleteDialogComponent,dialogPayload);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
  
        if(result != undefined && result == true) {
          this._itemService.deleteItem(item.id).then((resp) => {
              console.log("RESP FROM ITEM DELETE: ", resp);
              if(resp['success']) {
                  // callback to refresh all child lists
                  this.refresh.emit();

              }
          })
        }
      });
  }

  editItem(itemID:number) {
    let dialogPayload = {
        height: '700px',
        width: '600px',
        data: {
          itemID: itemID,
          raceID: this.raceID,
          isEdit:true
        }
      }
      let dialogRef = this.dialog.open(ItemFormDialogComponent,dialogPayload);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
  
        this.refresh.emit();
      });
  }

}