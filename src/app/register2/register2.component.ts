import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import {ErrorStateMatcher} from '@angular/material/core';
import * as moment from 'moment';
import { MustMatch } from './_helpers/must-match.validator';
import { UserProfileService } from '../userprofile.service';
import { ModalService } from '../modalServices';
import { RaceService } from '../race.service';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.css']
})
export class Register2Component implements OnInit {

  @Input() id: string;

  registerForm: FormGroup;
  credentialsForm: FormGroup;
  personalForm: FormGroup;

  formSegmentIndex = 0;
  loading = false;
  credentialsLoading = false;
  personalLoading = false;
  submitted = false;
  credentialsSubmitted = false;
  personalSubmitted = false;
  currentYear = new Date().getFullYear();
  
  credentialsErrors:any = [];
  personalErrors:any = [];
  errors: any = [];

  redirectParams: any = null;
  redirectUrl:string;
  genderOptions = ['Male', 'Female', 'Non-binary'];
  acceptedTerms:Boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route:ActivatedRoute,
    private _authService: AuthService,
    private _userProfileService:UserProfileService,
    private modalService: ModalService,
    private _raceService: RaceService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
    //   console.log('PARAMS:',params);
      if(params['params'] && params['params']['params']) {
        let inputs = JSON.parse(params['params']['params']);
     //    console.log('INPUTS:',inputs);
        this.redirectParams = inputs['redirectParams'];
        this.redirectUrl = inputs['redirectUrl']  
      }
    });

    this.ResetForms();
  }

   get d() { return this.modalService.modalsData[this.id]}

  onKeyUpEvent(event:any) {
    const {target} = event;
   //  console.log(target.name,target.value);
  }

  onCredentialsSubmit(event:any) {
    /*
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    */
   //  console.log('Credentials Check Processing');
    this.credentialsSubmitted = true;
    this.credentialsLoading = true;
    if (this.credentialsForm.invalid) {
      console.log('Credentials Check - something is wrong');
      this.credentialsLoading = false;
      return;
    }
    this.credentialsForm.value.email = this.credentialsForm.value.email.toLowerCase();
    this.ChangeFormSegment(1);
  }

  onPersonalSubmit(event:any) {
    /*
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    */
    this.personalSubmitted = true;
    this.personalLoading = true;

    this.acceptedTerms = true;

    // stop here if form is invalid
    if (this.personalForm.invalid) {
    //   console.log('Personal Check - something is wrong');
      this.personalLoading = false;
      return;
    }

   //  console.log("BIRTH. " ,this.personalForm.value.month_of_birth, this.personalForm.value.day_of_birth,this.personalForm.value.year_of_birth);
    const momentDate = new Date(
      this.personalForm.value.year_of_birth,
      this.personalForm.value.month_of_birth-1,
      this.personalForm.value.day_of_birth
    );
    const formattedDate = moment(momentDate).format("YYYY-MM-DD");
    this.personalForm.value.date_of_birth = formattedDate;

    this.registerForm = this.formBuilder.group({
      first_name: [this.personalForm.value.first_name, Validators.required],
      last_name: [this.personalForm.value.last_name, Validators.required],
      month_of_birth: [this.personalForm.value.month_of_birth, Validators.required],
      day_of_birth: [this.personalForm.value.day_of_birth, Validators.required],
      year_of_birth: [this.personalForm.value.year_of_birth, Validators.required],
      date_of_birth: [this.personalForm.value.date_of_birth, Validators.required],
      gender: [this.personalForm.value.gender, Validators.required],
      email: [this.credentialsForm.value.email, [Validators.required, Validators.email]], //Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
      password: [this.credentialsForm.value.password, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [this.credentialsForm.value.confirmPassword, Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
    },);

    //Register and navigate to login
    this._authService.register(this.registerForm.value).subscribe( 
      data => {
        let form = this.registerForm.value
        this._authService.login({email:form.email,password:form.password}).subscribe(
          
          data => {

            localStorage.setItem('access_token', data['token']);
            localStorage.setItem('loggedInUsername', data['username']);
            this._authService.username = data['username'];

            if(this.redirectParams) {
              this.router.navigate([this.redirectUrl,this.redirectParams]);
            }
            else {
               if(this.d.register == true)
                {
                  if(this.d.price > 0)
                  {
                    this.closeDialog() ;
                    this.openModal('custom-modal-3');

                  }
                  else
                  {
                    let registrationBody = {race_id:this.d.race_id} as any;
                    this._raceService.joinRace(registrationBody);
                    this.router.navigate(['/welcome']);
                  }
                }
                else
                {
            //       console.log("WELCOME");
                  this.router.navigate(['/welcome']);
                }
            }
            this.closeDialog();
          },
        err => {
          this.loading = false;
          this.errors = err['error'];
     //      console.log(this.errors);
        });
        
      },
      err => {
   //      console.log(err);
        this.loading = false;
        this.errors = err['error'];
    //     console.log(this.errors);
      });
  }

  ChangeFormSegment(n:number) {
    if (n == null) return;
    this.formSegmentIndex = n;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  get c() { return this.credentialsForm.controls; }
  get p() { return this.personalForm.controls;  }

  onSubmit() {
      this.submitted = true;
      this.acceptedTerms = true;
      // stop here if form is invalid
      if (this.registerForm.invalid) {
    //     console.log('onSubmit - something is wrong');
        return;
      }

      this.loading = true;
  //     console.log("BIRTH. " ,this.registerForm.value.month_of_birth, this.registerForm.value.day_of_birth,this.registerForm.value.year_of_birth);
      //Convert date field to Django-compatible format (YYYY-MM-DD)
      const momentDate = new Date(this.registerForm.value.year_of_birth,this.registerForm.value.month_of_birth-1,this.registerForm.value.day_of_birth);
      const formattedDate = moment(momentDate).format("YYYY-MM-DD");
      this.registerForm.value.date_of_birth = formattedDate;

      //Cast email to lowercase
      this.registerForm.value.email = this.registerForm.value.email.toLowerCase();

      //Register and navigate to login
      this._authService.register(this.registerForm.value).subscribe( 
        data => {
          let form = this.registerForm.value
          this._authService.login({email:form.email,password:form.password}).subscribe(
            
            data => {

              localStorage.setItem('access_token', data['token']);
              localStorage.setItem('loggedInUsername', data['username']);
              this._authService.username = data['username'];

              if(this.redirectParams) {
                this.router.navigate([this.redirectUrl,this.redirectParams]);
              }
              else {
                if(this.d.register = true)
                {
                  this.closeDialog() ;
                  this.openModal('custom-modal-3');
                }
                else
                {
                  this.router.navigate(['/welcome']);
                }
                
              }
              this.closeDialog();
            },
          err => {
            this.loading = false;
            this.errors = err['error'];
     //        console.log(this.errors);
          });
          
        },
        err => {
          console.log(err);
          this.loading = false;
          this.errors = err['error'];
     //      console.log(this.errors);
        });
  }

  ResetForms() {
    this.formSegmentIndex = 0;

    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      month_of_birth: ['', Validators.required],
      day_of_birth: ['', Validators.required],
      year_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], //Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
    },);
    this.submitted = false;
    this.loading = false;

    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], //Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password','confirmPassword')
    });
    this.credentialsLoading = false;
    this.credentialsSubmitted = false;

    this.personalForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      month_of_birth: ['', Validators.required],
      day_of_birth: ['', Validators.required],
      year_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
    },{});
    this.personalLoading = false;
    this.personalSubmitted = false;

  }

  closeDialog() {
    if (this.id == null) return;
    this.modalService.close(this.id);
    this.ResetForms();
  }

  SwitchToLogin = () => {
    this.closeDialog();
    this.modalService.open('custom-modal-1');
  }

  openModal(id: string) {
    const data = (id == 'custom-modal-3') ? {price:this.d.price,race_id:this.d.race_id,hasJoined:this.d.hasJoined,hasStarted:this.d.hasStarted,hasTags: this.d.hasTags} : null;
    console.log("REG MODAL DATA", data);
    this.modalService.open(id,data);
  }
}
