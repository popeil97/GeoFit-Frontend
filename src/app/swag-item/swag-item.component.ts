import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SwagService, Item, Order } from '../swag.service';

@Component({
  selector: 'app-swag-item',
  templateUrl: './swag-item.component.html',
  styleUrls: ['./swag-item.component.css']
})
export class SwagItemComponent implements OnInit {

  @Input() item:Item;
  @Input() order:Order;
  @Input() isOrder:Boolean = false;
  @Output() refreshState: EventEmitter<any> = new EventEmitter();
  sizes:string[] = ['S','M','L','XL','2XL','3XL','S (youth)','M (youth)','L (youth)'];
  btnDisabled:Boolean = true;
  selectedSize:string = '';

  constructor(private _swagService:SwagService) { }

  ngOnInit() {
      console.log("ITEM", this.item);

  }

  onSizeSelect(size:string) {
    console.log("SELECT SIZE", this.btnDisabled);

    this.btnDisabled=false;
    this.selectedSize = size;

    console.log("SELECT SIZE2" , this.btnDisabled);
  }

  addToCart() {

    if(this.item.sizes != null && this.selectedSize == null) {
      return;
    }

    this._swagService.addToCart(this.item.id,this.selectedSize).then((resp) => {
      this.init();
      this.refreshState.emit();
    })
  }

  addEntryToCart() {
    this.selectedSize = 'S';
    this._swagService.addToCart(this.item.id,this.selectedSize).then((resp) => {
      this.init();
      this.refreshState.emit();
    })
  }

  removeFromCart() {
    this._swagService.removeFromCart(this.order.id).then((resp) => {
      // call parent to refesh component
      this.refreshState.emit();
    })
  }

  init() {
    this.btnDisabled = true;
    this.selectedSize = '';
  }

}
