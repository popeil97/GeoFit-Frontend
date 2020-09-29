import { Component, AfterViewChecked, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { SignupCallbackStruct } from '../signup/signup.component';
import { PaymentsService, Payment, PaymentType } from '../payments.service';
declare let paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements AfterViewChecked {

  addScript:Boolean = false;
  loading: Boolean = false;
  @Output() transactionAlert: EventEmitter<any> = new EventEmitter();
  @Input() price:string;
  @Input() race_id:number = 1;
  paypalConfig:any;
  paymentError:Boolean;

  constructor(public _paymentsService:PaymentsService) {

    this.paypalConfig = {
      env:'production',
      createOrder: (data,actions) => {
       //  console.log('WAS PAYMENT');
        return this.getOrderID().then((resp) => {
       //    console.log('PAYMENT ID IS:',resp['id']);
          return resp['id'];
        })
      },

  
      onApprove: (data,actions) => {
        console.log('WAS AUTHORIZED',data);
        this._paymentsService.captureOrder(this.race_id,data['orderID']).then((resp) => {
          // GO GATORS
          if(resp['success']) {
            let successCallback = {} as any;
            successCallback.success = true;
            successCallback.type = 'PAYMENT';
            this.transactionAlert.emit(successCallback);
          }
        });
      },

      onError: (err) => {
        console.log('ERROR IN PAYPAL:',err);
        this.paymentError = true;
      }
    }


  }

  getOrderID():Promise<any> {
    return this._paymentsService.getOrderID(this.price);
  }

  
  savePayment(payment:Payment) {
    this.loading = true;
    console.log('SERVICE:',this._paymentsService)
    return this._paymentsService.confirmPayment(payment)
  }
  

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
      script_tag.src = "https://www.paypal.com/sdk/js?client-id=AQTMOSPwrQ-akqB85-nh8HKgQajoyuXC-AebVOzbqpeQYkXNLCqvV_Y5Bx6NasZxra8GGT_VU4n4M4xy"
      script_tag.onload = resolve;
      document.body.appendChild(script_tag);
    })
  }


}
