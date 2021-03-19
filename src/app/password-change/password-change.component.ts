import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TucanValidators } from '../services';
import { AuthService } from '../services';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  changeForm: FormGroup;
  loading = false;
  submitted = false;
  errors: any = [];
  slug: string;
  changed = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route:ActivatedRoute,
    private _authService: AuthService,) { 
      this.changeForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {
          validator: TucanValidators.MustMatch('password', 'confirmPassword')
      },
      
      );
    }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params['params']['slug'];
//       console.log(this.slug);
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changeForm.controls; }

  onSubmit(){
    if (this.changeForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    this._authService.changePassword(this.changeForm.value.password, this.slug).subscribe(
      data => {
        this.changed = true;
      },
      err => {
        this.errors = err['error'];
        this.loading = false;
      }
    )
  }

}
