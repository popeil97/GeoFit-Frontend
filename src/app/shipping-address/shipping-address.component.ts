import { Component, OnInit } from '@angular/core';
import { USPSShippingService } from '../usps-shipping';


@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {
  //All addresses of this user
  userAddresses = Array<Address>();

  stateOptions: string[];

  showAddressForm: boolean;

  dataSource = this.userAddresses;
  private columnsToDisplay:string[] = ['address', 'city-state', 'zip', 'buttons'];

  constructor(private _shippingService: USPSShippingService) { 
    this.showAddressForm = false;
  }

  ngOnInit() {
    this.getUserAddresses();
  }

  public toggleAddressForm(){
    this.showAddressForm = !this.showAddressForm;
  }

  getUserAddresses(){
    this._shippingService.getUserAddresses().then( data => {
      console.log(data);
      this.userAddresses = data as Address[];
      console.log(this.userAddresses);
    })
  }

  public addressChanged(){
    this.getUserAddresses();
    this.toggleAddressForm();
  }

  public deleteAddress(id){
    this._shippingService.deleteAddress(id).then(response => {
      this.getUserAddresses();
    })
  }

}

interface Address {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip4: string;
  zip5: string;
}
