import { Component, AfterViewChecked, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { SignupCallbackStruct } from '../signup/signup.component';
import { PaymentsService, Payment } from '../payments.service';
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
  @Input() race_id: number;
  paypalConfig:any

  constructor(public _paymentsService:PaymentsService) {

    this.paypalConfig = {
      env:'sandbox',
      client: {
        sandbox: 'AUbDVWGPpLKeW9t1DEjnv1rn8FJuzFutXamd9jX5iPFjh9PevctsO44etAeEJSiwQhktCY1ymdlEPP7C',
        production: 'prod key'
      },
      commit:true,
      createOrder: (data,actions) => {
        this.loading = true;
        return actions.order.create({
          purchase_units: [{
            amount: { value: this.price, currency:'USD' }
          }]
        });
      },
  
      onApprove: (data,actions) => {
        return actions.order.capture().then((details) => {
          console.log('PAYMENT AUTH:',details)
          let compStr = "COMPLETED";
          this.loading = false;
          if(details.status.localeCompare("COMPLETED") == 0) {
            let payment:Payment = {} as Payment
            payment.status = details.status;
            payment.paid = details.purchase_units[0].amount.value;
            payment.currency = details.purchase_units[0].amount.currency_code;
            payment.payment_id = details.id;
            payment.race_id = Number(this.race_id);
            console.log('PAYMENT OBJ:',payment);
            this.savePayment(payment);
            this.transactionAlert.emit({data:{},success:true,type:'PAYMENT'} as SignupCallbackStruct);
          }
  
          else {
            this.transactionAlert.emit({data:{},success:false,type:'PAYMENT'} as SignupCallbackStruct);
          }
  
        });
      }
    }


  }

  
  savePayment(payment:Payment): void {
    console.log('SERVICE:',this._paymentsService)
    this._paymentsService.confirmPayment(payment).then((resp) => {
      console.log('CONFIRMED FROM SERVER:',resp);
    });
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
      script_tag.src = "https://www.paypal.com/sdk/js?client-id=AUbDVWGPpLKeW9t1DEjnv1rn8FJuzFutXamd9jX5iPFjh9PevctsO44etAeEJSiwQhktCY1ymdlEPP7C"
      script_tag.onload = resolve;
      document.body.appendChild(script_tag);
    })
  }


}
