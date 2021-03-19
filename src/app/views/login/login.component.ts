import { 
  Component, 
  OnInit, 
  Output, 
  EventEmitter, 
  NgModule,
  Inject,
  OnDestroy,
} from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { 
  AuthService,
  UserProfileService, 
} from '../../services';
import {
  UserData,
} from '../../models';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  @Output() openRegister = new EventEmitter();
  @Output() openSignUp = new EventEmitter();

  loginForm: FormGroup = null;
  loading = false;
  submitted = false;
  errors: any = [];
  public registerMe:boolean = false;

  @Output() loggedInAsUsernameEvent = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private _authService: AuthService,
    private _userProfileService: UserProfileService,

    public dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef : MatDialogRef<LoginComponent>,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], //Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
      password: ['', Validators.required]
    });
  }
  ngOnDestroy() {
    this.loginForm = null;
    this.errors = null;
  }

  navigateTo(url:string = null) {
    if (url != null) this.router.navigate([url]);
    this.dialogRef.close();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {

    // Catch for submission
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) { return; }

    this.loading = true;

    var email = this.f.email.value.toLowerCase();

    this._authService.login({'email': email, 'password': this.f.password.value}).then(loginData => {
      if (loginData['success']){
        // store local storage variables
        localStorage.setItem('access_token', loginData['token']);
        localStorage.setItem('loggedInUsername', loginData['username']);
        this._authService.username = loginData['username'];

        //Emit to Output
        this.loggedInAsUsernameEvent.emit(loginData['username']);

        // Update user data
        this._userProfileService.requestUserProfile(this._authService.username).then(ud=>{
          // Emit to  authService subscribers
          this._authService.emitLoginStausChange();
          this._authService.updateUserData(ud as UserData);

          // Continue
          //this.continueAsMe(loginData['username']);
          this.closeDialog();
        }).catch(uerr=>{
          console.error(uerr);
          this.loading = false;
          this.errors = uerr['error'];
        });
      }
    }).catch(err => {
      this.loading = false;
      this.errors = err['error'];
    });
  }

  toggleRegister(action?:string) {
    this.registerMe = !this.registerMe;
  }

  /*
  public continueAsMe(username?:string){
    // this.router.navigate(['/profile', {username: username}]);
  }
  */

  closeDialog() {
    this.loginForm.reset();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginForm.updateValueAndValidity();
    this.loading = false;
    this.submitted = false;
    this.dialogRef.close();
  }

  SwitchToRegister = () => {
    this.openRegister.emit();
    this.closeDialog();
  }
  SwitchToSignUp = () => {
    this.openSignUp.emit();
    this.closeDialog();
  }

}