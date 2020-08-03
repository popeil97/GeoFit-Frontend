import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { USPSShippingService } from '../usps-shipping';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-shipping-address-form',
  templateUrl: './shipping-address-form.component.html',
  styleUrls: ['./shipping-address-form.component.css']
})
export class ShippingAddressFormComponent implements OnInit {
  @Input() address: Address;
  
  //Emit to parent component when address change is complete
  @Output() addressChanged: EventEmitter<void> = new EventEmitter();

  //Pending address which user must confirm
  pendingAddress: Address;

  //Switch to show pending address after form submit
  showPendingAddress: boolean;


  addressForm: FormGroup;

  stateOptions: string[];

  constructor(private _shippingService: USPSShippingService) { 
    this.stateOptions = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 
        'IA', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 
        'WV', 'WI', 'WY']

    this.addressForm = new FormGroup({
      address1: new FormControl('', [
        Validators.maxLength(50)
      ]),
      address2: new FormControl('', [
        Validators.maxLength(50)
      ]),
      city: new FormControl('', [
        Validators.maxLength(20)
      ]),
      state: new FormControl(''),
      zip5: new FormControl('', [
        Validators.maxLength(5)
      ]),
    })

    this.showPendingAddress = false;
  }

  ngOnInit() {
  }

  validateAddress(): void {
    let formClean: Address;

    if (this.addressForm.valid){
      formClean = this.addressForm.value;

      this._shippingService.validateAddress(formClean).then(response => {
        console.log("Response from USPS");
        console.log(response);
        this.pendingAddress = response['address'] as Address;
        console.log(this.pendingAddress);

        this.showPendingAddress = true;

        //here we gotta check if shipping address was valid and created
        //if it was, revert to address view and updated addresses (getUserAddresses())
        //if not, display err message
      })
    }
  }

  submitConfirmedAddress(): void{
    this._shippingService.submitAddress(this.pendingAddress).then(response => {
      console.log(response);
      console.log(response);
      if (response['created'] == true){
        this.addressChanged.emit(response['id'])
      }
      else{
        //handle errors
      }
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
