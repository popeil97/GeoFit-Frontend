import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../users/users.service';
import { SignupCallbackStruct } from '../signup/signup.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    errors: any = [];

    @Output() registerAlert: EventEmitter<any> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private _userService: UserService,
    ) {}

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;

        //Register and navigate to login
        this._userService.register(this.registerForm.value).subscribe( 
          data => {
            if(this.registerAlert) {
              let form = this.registerForm.value
              this.registerAlert.emit({ data:{username:form.username,password:form.password}, success:true, type:"REGISTER" } as SignupCallbackStruct)
            }
            this.router.navigate['/login'];
          },
          err => {
            this.loading = false;
            this.errors = err['error']
            this.registerAlert.emit({ data:{}, success:false, type:"REGISTER" } as SignupCallbackStruct)
          });

    }
}