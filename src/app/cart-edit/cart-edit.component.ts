import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SwagListComponent } from '../swag-list/swag-list.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart-edit',
  templateUrl: './cart-edit.component.html',
  styleUrls: ['./cart-edit.component.css']
})
export class CartEditComponent implements OnInit,OnChanges {

  @Input() raceID:number;
  @Output() checkoutAlert: EventEmitter<any> = new EventEmitter();
  @ViewChild('cart') cartList:SwagListComponent;
  @ViewChild('items') itemList:SwagListComponent;
  public checkoutDisabled: Boolean = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        switch(propName) {
          case 'raceID':
            if (!_.isEqual(changes.raceID.currentValue, changes.raceID.previousValue) && changes.raceID.currentValue != undefined){
              // this.refreshSwagLists();
            }
        }
      }
    }
  }

  ngOnInit() {
  }

  refreshCart() {
    this.cartList.init();
  }

  refreshSwagLists() {
    this.itemList.init();
    this.cartList.init();
  }

  checkout() {
    let checkoutCallback = {} as any;
    checkoutCallback.success = true;
    checkoutCallback.type = 'CHECKOUT';
    checkoutCallback.data = this.cartList.getCart();
    //console.log(";CART", checkoutCallback.data );
    if(checkoutCallback.data.orders.length>=1)
    {
      this.checkoutAlert.emit(checkoutCallback);
      this.checkoutDisabled = false;
      console.log("CHECKOUT PROCEED");
    }
    else
    {
      this.checkoutDisabled = true;
      console.log("CHECKOUT BLOCKED");
    }

    

  }

}
