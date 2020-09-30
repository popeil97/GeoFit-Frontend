import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { SwagService, Item, Order, Cart } from '../swag.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-swag-list',
  templateUrl: './swag-list.component.html',
  styleUrls: ['./swag-list.component.css']
})
export class SwagListComponent implements OnInit,OnChanges {

  @Input() raceID:number;
  @Input() isCart:Boolean;
  @Output() refreshCart: EventEmitter<any> = new EventEmitter();

  public items:any = null;
  public cart:any = null;

  constructor(private _swagService:SwagService) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        switch(propName) {
          case 'raceID':
            if (!_.isEqual(changes.raceID.currentValue, changes.raceID.previousValue) && changes.raceID.currentValue != undefined){
              this.init();
            }
        }
      }
    }
  }

  init() {
    if(this.isCart) {
      this._swagService.getCart(this.raceID).then((resp) => {
    //     console.log('ORDERS:',resp['cart']);
        this.cart = resp['cart'];
      })
    }

    else {
      this._swagService.getItems(this.raceID).then((resp:any) => {
     //    console.log('Items for sale:',resp['items']);
        this.items = resp['items'];
      });
    }



  }

  getCart() {
    return this.cart;
  }

  refreshCallback() {
    if(this.isCart) { // order was removed
      this.init();
    }

    else { // order was added, tell parent component to refresh list that holds cart orders
      this.refreshCart.emit();
    }
  }

}
