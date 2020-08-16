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
  @Input() race_id: number;
  @Input() paymentType: PaymentType;
  paypalConfig:any;
  paymentError:Boolean;

  constructor(public _paymentsService:PaymentsService) {

    this.paypalConfig = {
      env:'production',
      client: {
        production: 'AQTMOSPwrQ-akqB85-nh8HKgQajoyuXC-AebVOzbqpeQYkXNLCqvV_Y5Bx6NasZxra8GGT_VU4n4M4xy'
      },
      commit:true,
      createOrder: (data,actions) => {
        
        console.log('PAYMENT TYPE:',this.paymentType);
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
            payment.payment_type = this.paymentType;
            console.log('PAYMENT OBJ:',payment);
            this.savePayment(payment).then((resp) => {
              console.log('CONFIRMED FROM SERVER:',resp);
              let payment_id = resp['id'];
              this.transactionAlert.emit({data:{payment_id:payment_id},success:true,type:'PAYMENT'} as SignupCallbackStruct);
              
            });
            
          }
  
          else {
            this.transactionAlert.emit({data:{},success:false,type:'PAYMENT'} as SignupCallbackStruct);
          }
  
        });
      },

      onError: (err) => {
        console.log('ERROR IN PAYPAL:',err);
        this.paymentError = true;
      }
    }


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
