import { Component, OnInit, EventEmitter, Output, Input, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { SwagService } from '../swag.service';
import { PaymentType } from '../payments.service';
import { SignupCallbackStruct } from '../signup/signup.component';
import { Order, OrderService } from '../order.service';

interface SwagDialogData {
  price:string,
  race_id:number,
  imageUrl:any,
}

interface SwagForm {
  title:string,
  description:string,
  price:string,
  image:any,
}

interface SwagStepCallbackData {
  succes:Boolean;
  data:any;
  type:string;
}

@Component({
  selector: 'app-swag',
  templateUrl: './swag.component.html',
  styleUrls: ['./swag.component.css']
})
export class SwagComponent implements OnInit {

  constructor(public dialog: MatDialog,private _swagService:SwagService) { }

  @Output() signupCallback: EventEmitter<any> = new EventEmitter();
  @Input() price: any;
  @Input() race_id: number;
  @Input() hasPaid: Boolean = false;
  @Input() isOwner: Boolean = false;
  swagForm: FormGroup;
  isEdit:Boolean = false;
  uploadedUrl:any;
  swagModelForm: SwagForm = {} as SwagForm;

  ngOnInit() {
    this._swagService.getSwagForm(this.race_id).then((resp:SwagForm) => {
      this.swagModelForm = resp['form'];
    //   console.log('SWAG STUFF:',this.swagModelForm);
      this.initForm();
    });
    
  }

  initForm() {
    this.swagForm = new FormGroup({
      title: new FormControl(this.swagModelForm.title,[
        Validators.required
      ]),
      description: new FormControl(this.swagModelForm.description,[
        Validators.required
      ]),
      price: new FormControl(this.swagModelForm.price,[
        Validators.required
      ]),
      merchImg: new FormControl(''),
    });
  }

  openDialog() {

    const dialogRef = this.dialog.open(SwagDialogContent,{disableClose: true, data:{price:this.swagModelForm.price,race_id:this.race_id,imageUrl:this.swagModelForm.image} as MatDialogConfig});

    dialogRef.afterClosed().subscribe(result => {
   //    console.log(`Dialog result: ${result}`);

      if(result) {
        this.signupCallback.emit();
      }
    });

  }

  closeDialog() {
    this.dialog.closeAll();
  }

  toggleForm() {
    this.isEdit = !this.isEdit;
  }

  update() {
    
    if(this.swagForm.valid) {
      let cleanForm = this.swagForm.value;
      // call swag service to update model
      // then call function to get new about data
      cleanForm.merchImg = this.uploadedUrl;
    //   console.log('CLEAN:',cleanForm);

      this._swagService.updateSwagForm(this.race_id,cleanForm).then((resp:any) => {
      //   console.log('UPDATED SWAG FORM:',resp);
        this.swagModelForm = resp['form'] as SwagForm;
        this.initForm();
        this.toggleForm()
      });
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadedUrl = reader.result;
      }
    }
  }

  

}

@Component({
  selector: 'swag-dialog-content',
  templateUrl: 'swag-dialog-content.html',
})

export class SwagDialogContent {
  price:string;
  race_id:number;
  sizes:string[] = ['S','M','L','XL','2XL','3XL'];
  completeOrder:Order = {} as Order
  imageUrl:any;
  
  paymentType = PaymentType.SWAG;
  @ViewChild('stepper') public stepper: MatStepper;
  paymentForm = new FormGroup({
    complete: new FormControl('',[
      Validators.required
    ])
  });

  shippingForm = new FormGroup({
    complete: new FormControl('',[
      Validators.required
    ])
  });

  sizeForm = new FormGroup({
    size: new FormControl('',[
      Validators.required
    ])
  })


  constructor(public dialogRef: MatDialogRef<SwagDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: SwagDialogData, private _orderService:OrderService) {
      this.price = data.price;
      this.race_id = data.race_id;
      this.completeOrder.race_id = this.race_id;
      this.imageUrl = data.imageUrl;
  }

  stepCallback(callbackResp:SignupCallbackStruct) {
    if(callbackResp.success) {
      let data = callbackResp.data;

      if(callbackResp.type == 'PAYMENT') {
      //   console.log('PAYMENT DATA:',data);
        this.completeOrder.payment_id = data.payment_id;
        this.paymentForm.controls['complete'].setValue(true);
        this.stepper.next();
      }
      
    }
  }

  shippingConfirmed(id:number) {
    this.shippingForm.controls['complete'].setValue(true);
    this.completeOrder.shipping_id = id;
    // this is last step so submit
    this._orderService.submitOrder(this.completeOrder).then((resp) => {
      this.stepper.next();
   //    console.log('ORDER:',this.completeOrder);
    })
    
  }

  selectSize(size:string) {
    this.sizeForm.controls['size'].setValue(size);
  }

  confirmSize() {
    this.completeOrder.details = this.sizeForm.value.size
    this.stepper.next();
  }

}
