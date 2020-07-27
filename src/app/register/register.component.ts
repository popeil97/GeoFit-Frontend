import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth.service';

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

    redirectParams: any = null;
    redirectUrl:string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route:ActivatedRoute,
        private _authService: AuthService,
    ) {}

    ngOnInit() {

      this.route.paramMap.subscribe(params => {
        console.log('PARAMS:',params);
        if(params['params']) {
          let inputs = JSON.parse(params['params']['params']);
          console.log('INPUTS:',inputs);
          this.redirectParams = inputs['redirectParams'];
          this.redirectUrl = inputs['redirectUrl']
        }
        
      });

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
        this._authService.register(this.registerForm.value).subscribe( 
          data => {
            let form = this.registerForm.value
            this._authService.login({username:form.username,password:form.password}).subscribe(
              
              data => {
                console.log('LOGIN RESP:',data);

                localStorage.setItem('access_token', data['token']);
                localStorage.setItem('loggedInUsername', form.username);
                this._authService.username = form.username;

                if(this.redirectParams) {
                  this.router.navigate([this.redirectUrl,this.redirectParams])
                }
    
                else {
                  this.router.navigate['/login'];
                }
              },
            err => {
              this.loading = false;
              this.errors = err['error']
            });
            
          },
          err => {
            this.loading = false;
            this.errors = err['error']
          });

    }
}