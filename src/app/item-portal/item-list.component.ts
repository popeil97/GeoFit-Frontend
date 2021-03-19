import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ItemService } from '../item.service';
import { RaceService } from '../services';
import { Item, ItemType } from '../swag.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  
  @Input() raceID:number;
  @Input() itemType:ItemType;

  public items:Item[];

  constructor(
    private _itemService:ItemService,
    private _raceService:RaceService
  ) {}

  ngOnInit() {
    this._itemService.getItemsByType(this.raceID,this.itemType).then((resp) => {
        this.items = resp['items'];
        console.log("ITEMS: ",this.items);
    });

    this._raceService.getRaceSettings(this.raceID).then((resp) => {

        

        console.log("RESP FROM RACE SETTINGS: ", resp);
    });

    let form = {
        isManual:false,
        allowTeams:true,
        maxTeamSize:3,
        price: 0.01,
        hasEntryTags: false
    };

    this._raceService.updateOrCreateRaceSettings(this.raceID,form).then((resp) => {
        console.log("RACE SETTINGS UPDATE: ",resp);
    });
  }

}