import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { SwagListComponent } from '../swag-list/swag-list.component';

@Component({
  selector: 'app-cart-edit',
  templateUrl: './cart-edit.component.html',
  styleUrls: ['./cart-edit.component.css']
})
export class CartEditComponent implements OnInit {

  @Input() raceID:number;
  @Output() checkoutAlert: EventEmitter<any> = new EventEmitter();
  @ViewChild('cart') cartList:SwagListComponent;

  constructor() { }

  ngOnInit() {
  }

  refreshCart() {
    console.log('GONNA CALL INIT ON CART');
    this.cartList.init();
  }

  checkout() {

    let checkoutCallback = {} as any;
    checkoutCallback.success = true;
    checkoutCallback.type = 'CHECKOUT';
    checkoutCallback.data = this.cartList.getCart();

    this.checkoutAlert.emit(checkoutCallback);

  }

}
