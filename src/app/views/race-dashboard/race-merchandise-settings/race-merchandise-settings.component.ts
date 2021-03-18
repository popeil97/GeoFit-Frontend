import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RaceMerchandiseSettingsItemComponent } from './race-merchandise-settings-item/race-merchandise-settings-item.component';

@Component({
  selector: 'app-race-merchandise-settings',
  templateUrl: './race-merchandise-settings.component.html',
  styleUrls: [
    './race-merchandise-settings.component.css',
    '../../../../styles/forms.css'
  ]
})
export class RaceMerchandiseSettingsComponent implements OnInit,OnDestroy {

  @Input() raceID:number = null;
  @Input() raceData:any = null;
  @Input() getRaceDataCallback: (callback:any) => void;

  private debugMode:boolean = false;

  public merchandiseItems:Array<MerchandiseItem> = [];
  public entryItems:Array<MerchandiseItem> = [];

  private exampleRaceData = {
    race_id:"33",
    merchandise:[
      {
        id:"firstMerch",
        name:"Millenial Thermos",
        description:"A thermos perfect for millenials!",
        price:10.00,
        image_file:"http://127.0.0.1:8000/media/swag_images/default-swag-image.jpg",
        item_type:2,
        item_state:1,
        sizes:"",
      },
      {
        id:"secondMerch",
        name:"Millenial T-Shirt",
        description:"A T-Shirt fit for millenials!",
        price:7.00,
        image_file:"http://127.0.0.1:8000/media/swag_images/default-swag-image.jpg",
        item_type:2,
        item_state:2,
        sizes:"S,M,L",
      },
    ],
    entries:[
      {
        id:"firstEntry",
        name:"Registration Fee",
        description:"All racers must provide a nominal fee in order to participate in this race.",
        price:2.00,
        image_file:"http://127.0.0.1:8000/media/swag_images/default-swag-image.jpg",
        item_type:1,
        item_state:1,
        sizes:"",
      }
    ]
  }

  constructor(
    private dialog : MatDialog,
  ) { }

  ngOnInit() {
    this.initializeData();
  }
  ngOnDestroy() {
    this.merchandiseItems = null;
    this.entryItems = null;
  }

  initializeData() {
    this.merchandiseItems = (this.debugMode) ? this.exampleRaceData.merchandise : this.raceData.merchandise;
    this.entryItems = (this.debugMode) ? this.exampleRaceData.entries : this.raceData.entries;
  }
  
  createNewMerchandiseItem() {
    this.openMerchandiseItem(null,null,2);
  }
  createNewEntryItem() {
    this.openMerchandiseItem(null,null,1);
  }
  openMerchandiseItem(item:MerchandiseItem,itemIndex:number,type:number) {
    const data = {
      raceID:this.raceID,
      itemData:item,
      itemIndex:itemIndex,
      itemType:type,
    }
    this.dialog.open(RaceMerchandiseSettingsItemComponent,{
      panelClass:"MerchandiseItemFormContainer",
      data:data,
    }).afterClosed().subscribe(result=>{
      if (result != null) {
        // There was some kind of response, and it's expected to be successful
        this.getRaceDataCallback(()=>{
          this.initializeData();
        })
      }
    });
  }

}

interface MerchandiseItem {
  id:string,
  name:string,
  description:string,
  price:number,
  image_file:any,
  type:number
  state:number,
  sizes:string,
}
interface MerchandiseType {
  name:string,
  dbValue:string,
}
const MerchandiseTypes = {
  "entry":{
    name:"Entry",
    dbValue:"ENTRY"
  },
  "ENTRY":{
    name:"Entry",
    dbValue:"ENTRY"
  },
  "swag":{
    name:"Swag",
    dbValue:"SWAG"
  },
  "SWAG":{
    name:"Swag",
    dbValue:"SWAG"
  },
  "entryAndSwag":{
    name:"Entry and Swag",
    dbValue:"ENTRYANDSWAG"
  },
  "ENTRYANDSWAG":{
    name:"Entry and Swag",
    dbValue:"ENTRYANDSWAG"
  },
};
enum ItemStates {
  ACTIVE=1,
  INACTIVE=2,
}
enum ItemTypes {
  ENTRY=1,
  SWAG=2,
  ENTRYANDSWAG=3,
}

export {
  MerchandiseTypes,
  MerchandiseType,
  MerchandiseItem,
  ItemStates,
  ItemTypes,
}