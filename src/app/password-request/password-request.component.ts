import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services';

@Component({
  selector: 'app-password-request',
  templateUrl: './password-request.component.html',
  styleUrls: ['./password-request.component.css']
})
export class PasswordRequestComponent implements OnInit {
  requestForm: FormGroup;
  loading = false;
  submitted = false;
  emailSent = false;
  errors: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route:ActivatedRoute,
    private _authService: AuthService,) 
    { 
      this.requestForm = this.formBuilder.group({
        email: ['', [Validators.required,
                      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
                    });
    }

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.requestForm.controls; }

  onSubmit(){
    if (this.requestForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    this._authService.requestPassword(this.requestForm.value.email).subscribe(
      data => {
        this.emailSent = true;
        this.loading = false;
      },
      err => {
        this.errors = err['error'];
        this.loading = false;
      }
    )
  }

}
