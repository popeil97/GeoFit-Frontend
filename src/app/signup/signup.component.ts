import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentType } from '../payments.service';
import { AboutData } from '../race-about/race-about.component';


interface SignupDialogData {
  price:string,
  isLoggedIn:Boolean,
  race_id:number,
  aboutData:AboutData,
  hasStarted:Boolean,
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public dialog: MatDialog, private _authService: AuthService,private route:ActivatedRoute, 
    private router:Router) { }

  @Output() signupCallback: EventEmitter<any> = new EventEmitter();
  @Input() price: any;
  @Input() race_id: number;
  @Input() hasPaid: Boolean = false;
  @Input() aboutData: AboutData = {} as AboutData;
  @Input() hasStarted:Boolean;

  openDialog() {

    console.log('PRICE FORM PARENT:',this.price)
    if(!(this.price == null || this.price == undefined) && !this.hasPaid) {
      this.price = this.price.toString();
      console.log('price after tostring:',this.price)
    }

    else {
      this.price = null;
    }

    const dialogRef = this.dialog.open(SignupDialogContent,{disableClose: true, data:{price:this.price,isLoggedIn:this._authService.isLoggedIn(),race_id:this.race_id,aboutData:this.aboutData,hasStarted:this.hasStarted} as MatDialogConfig});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result) {
        this.signupCallback.emit();
      }
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  ngOnInit() {
  }

}


@Component({
  selector: 'signup-dialog-content',
  templateUrl: 'signup-dialog-content.html',
})
export class SignupDialogContent {
  paymentType = PaymentType.ENTRY;
  isLoggedIn:Boolean;
  price:any;
  isSuccess:Boolean = false;
  needsPayment:Boolean = false;
  race_id:number;
  hasStarted:Boolean;
  aboutData:AboutData;
  @ViewChild('stepper') public stepper: MatStepper;

  registerLoginform: FormGroup = new FormGroup({
    complete: new FormControl('',[
      Validators.required,
    ]),
  });
  
  paymentForm: FormGroup = new FormGroup({
    complete: new FormControl('',[
      Validators.required,
    ]),
  })

  constructor(
    public dialogRef: MatDialogRef<SignupDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: SignupDialogData) { 
      this.isLoggedIn = data.isLoggedIn;
      this.price = data.price;
      this.race_id = data.race_id;
      this.hasStarted = data.hasStarted;
      this.aboutData = data.aboutData;
      if(this.price != null && this.price != undefined) {
        this.needsPayment = true;
      }
      console.log('PRICE:',this.price)
      console.log('NEEDS PAYMENT:',this.needsPayment);
      console.log('ABOUT DATA FROM CHILD:',data.aboutData);
      console.log('hasStarted:',this.hasStarted);
    }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  stepCallback(callbackStruct:SignupCallbackStruct): void {
    // if step is completed correctly then do stepper.next()
    let success = callbackStruct.success;
    let data = callbackStruct.data;
    let type = callbackStruct.type;

    if(success) {
      console.log('STEPPER INDEX:',this.stepper.selectedIndex);
      if(type == 'REGISTER') {
        this.registerLoginform.controls['complete'].setValue(true);
        console.log('COMPLETE REGISTER',this.registerLoginform);
      }
      if(type == 'PAYMENT') {
        this.paymentForm.controls['complete'].setValue(true);
      }
      this.stepper.next();
      if(this.stepper._steps.length - 1 == this.stepper.selectedIndex) {
        this.stepCallback.emit();
      }
    }
  }

}

export interface SignupCallbackStruct {
  success:Boolean,
  data: any,
  type:string,
}