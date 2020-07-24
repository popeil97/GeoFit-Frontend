import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
declare let paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements AfterViewChecked {

  private amount: string = '3.00';
  addScript:Boolean = false;

  paypalConfig = {
    env:'sandbox',
    client: {
      sandbox: 'AUbDVWGPpLKeW9t1DEjnv1rn8FJuzFutXamd9jX5iPFjh9PevctsO44etAeEJSiwQhktCY1ymdlEPP7C',
      production: 'prod key'
    },
    commit:true,
    createOrder: (data,actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: { value: '5.00', currency:'USD' }
        }]
      });
    },

    onApprove: (data,actions) => {
      return actions.order.capture().then((details) => {
        console.log('PAYMENT AUTH:',details)
      });
    }
  }

  constructor() { }

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Buttons(this.paypalConfig).render('#paypal-view')
      })
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve,reject) => {
      let script_tag = document.createElement('script');
      script_tag.src = "https://www.paypal.com/sdk/js?client-id=AUbDVWGPpLKeW9t1DEjnv1rn8FJuzFutXamd9jX5iPFjh9PevctsO44etAeEJSiwQhktCY1ymdlEPP7C"
      script_tag.onload = resolve;
      document.body.appendChild(script_tag);
    })
  }


}
