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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    constructor(public dialog: MatDialog,) {

    }

    openDialog() {
      const dialogRef = this.dialog.open(RegisterDialogContent,{disableClose: false, data:{} as MatDialogConfig});
    }


}

@Component({
  selector: 'app-register-dialog-content',
  templateUrl: './register-dialog-content.html',
})

export class RegisterDialogContent {

  public type: any
  registerForm: FormGroup;
  formSegmentIndex = 0;
  loading = false;
  submitted = false;
  errors: any = [];

  redirectParams: any = null;
  redirectUrl:string;
  genderOptions:any[];

  acceptedTerms:Boolean = true;

   constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route:ActivatedRoute,
        private _authService: AuthService,
        private _userProfileService:UserProfileService,
        public dialogRef: MatDialogRef<RegisterDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.genderOptions = ['Male', 'Female', 'Non-binary'];
    }


      ngOnInit() {

      this.route.paramMap.subscribe(params => {
        console.log('PARAMS:',params);
        if(params['params']) {
          let inputs = JSON.parse(params['params']['params']);
        //   console.log('INPUTS:',inputs);
          this.redirectParams = inputs['redirectParams'];
          this.redirectUrl = inputs['redirectUrl']
          
        }
        
      });

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
        },
        
        );
    }

    ChangeFormSegment(n:number) {
      if (n == null) return;
      this.formSegmentIndex = n;
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.acceptedTerms = true;
     //    console.log('REEE',this.acceptedTerms);
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
   //      console.log("BIRTH. " ,this.registerForm.value.month_of_birth, this.registerForm.value.day_of_birth,this.registerForm.value.year_of_birth);
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
                  this.router.navigate(['/welcome']);
                }
                this.closeDialog();
              },
            err => {
              this.loading = false;
              this.errors = err['error'];
      //         console.log(this.errors);
            });
            
          },
          err => {
            console.log(err);
            this.loading = false;
            this.errors = err['error'];
      //       console.log(this.errors);
          });

    }
    closeDialog() {
    this.dialogRef.close(RegisterDialogContent);
  }

}