import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { UserService } from '../users/users.service';

interface DialogData {
  price:string,
  isLoggedIn:Boolean,
  race_id:number,
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public dialog: MatDialog, private _userService: UserService) { }

  @Output() signupCallback: EventEmitter<any> = new EventEmitter();
  @Input() isLoggedIn: Boolean;
  @Input() price: any;
  @Input() race_id: number;

  openDialog() {
    console.log('PRICE FORM PARENT:',this.price)
    if(!(this.price == null || this.price == undefined)) {
      this.price = this.price.toString();
      console.log('price after tostring:',this.price)
    }

    else {
      this.price = null;
    }

    const dialogRef = this.dialog.open(SignupDialogContent,{disableClose: true, data:{price:this.price,isLoggedIn:this._userService.isLoggedIn(),race_id:this.race_id} as MatDialogConfig});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result) {
        this.signupCallback.emit();
      }
    });
  }

  ngOnInit() {
  }

}


@Component({
  selector: 'signup-dialog-content',
  templateUrl: 'signup-dialog-content.html',
})
export class SignupDialogContent {

  isLoggedIn:Boolean;
  price:any;
  isSuccess:Boolean = false;
  needsPayment:Boolean = false;
  race_id:number;
  @ViewChild('stepper') private stepper: MatStepper;

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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
      this.isLoggedIn = data.isLoggedIn;
      this.price = data.price;
      this.race_id = data.race_id;
      if(this.price != null && this.price != undefined) {
        this.needsPayment = true;
      }
      console.log('PRICE:',this.price)
      console.log('NEEDS PAYMENT:',this.needsPayment);
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
    }
  }

}

export interface SignupCallbackStruct {
  success:Boolean,
  data: any,
  type:string,
}