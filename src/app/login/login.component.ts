import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

import { first } from 'rxjs/operators';
import { UserProfileService } from '../userprofile.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errors: any = [];
  public registerMe:Boolean = false;

  @Output() loggedInAsUsernameEvent = new EventEmitter();

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private _authService: AuthService,
      private _userProfileService: UserProfileService,
  ) {}

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });

      // get return url from route parameters or default to '/'
      //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'races';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this._authService.login({'username': this.f.username.value, 'password': this.f.password.value}).subscribe(
        data => {
          localStorage.setItem('access_token', data['token']);
          localStorage.setItem('loggedInUsername', this.f.username.value);
          this._authService.username = this.f.username.value;

          //Emit
          this.loggedInAsUsernameEvent.emit(this.f.username.value);

          if (data['success']){
            //this.router.navigate([this.returnUrl]);
            
            //Route to our profile page for now
            this._userProfileService.goToUserProfile(this.f.username.value);
          }
        },
        err => {
          this.loading = false;
          this.errors = err['error']
        }
      );
  }

  toggleRegister(action?:string) {
    this.registerMe = !this.registerMe;
   
  }
}
