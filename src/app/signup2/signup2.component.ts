import { Component, OnInit, OnChanges, Inject, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentType } from '../payments.service';
import { AboutData } from '../race-about/race-about.component';
import { TagType } from '../tags.service';
import { RaceService } from '../race.service';
import { Cart } from '../swag.service';
import { ModalService } from '../modalServices';

interface SignupDialogData {

  price:string,
  isLoggedIn:Boolean,
  race_id:number,
  aboutData:AboutData,
  hasStarted:Boolean,
  hasTags:Boolean,
}

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.component.html',
  styleUrls: ['./signup2.component.css']
})
export class Signup2Component implements OnInit {

  constructor(
    public dialog: MatDialog, 
    private _authService: AuthService,
    private route:ActivatedRoute, 
    private router:Router, 
    private _raceService:RaceService, 
    private modalService: ModalService
  ) {}

  @Input() id: string;

  @Output() signupCallback: EventEmitter<any> = new EventEmitter();
  @Input() price: any;
  @Input() race_id: number;
  @Input() hasPaid: Boolean = false;
  @Input() aboutData: AboutData = {} as AboutData;
  @Input() hasStarted:Boolean;
  @Input() hasTags:Boolean;

  modalData: any;
  isLoggedIn:Boolean;
  needsPayment:Boolean = false;

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
  });

  tagForm: FormGroup = new FormGroup({
    tagID: new FormControl('',[
      Validators.required
    ]),
  });

  cartForm: FormGroup = new FormGroup({
    complete: new FormControl('',[
      Validators.required,
    ])
  });


  ngOnInit() {
    this.isLoggedIn = this._authService.isLoggedIn();
  	if(this.price != null && this.price != undefined) {
      this.needsPayment = true;
    }
  }

  get d() { return this.modalService.modalsData[this.id]}

  stepCallback(callbackStruct:any): void {
    // if step is completed correctly then do stepper.next()
    let success = callbackStruct.success;
    
    let type = callbackStruct.type;

    console.log(callbackStruct);

    if(success) {
      console.log('STEPPER INDEX:',this.stepper.selectedIndex);
      if(type == 'REGISTER') {
        
        this.registerLoginform.controls['complete'].setValue(true);
        console.log('COMPLETE REGISTER',this.registerLoginform);
      }
      if(type == 'PAYMENT') {
        this.paymentForm.controls['complete'].setValue(true);
        let registrationBody = {race_id:this.race_id} as any;

        if(this.hasTags) {
          let tagFormClean = this.tagForm.value as any;
          registrationBody.tag_id = tagFormClean.tagID
        }
        this._raceService.joinRace(registrationBody);
      }

      if(type == 'TAG') {
        let data = callbackStruct.data;
        this.tagForm.controls['tagID'].setValue(data.id);
      }

      if(type == 'CHECKOUT') {
        // do nothing?
        let cart:Cart = callbackStruct.data;
        this.price = cart.price.toString();
        this.cartForm.controls['complete'].setValue(true);
      }
      this.stepper.next();
    }
  }

  closeDialog() {
    if (this.id == null) return;
    this.modalService.close(this.id);
  }

}