import { 
  Component, 
  OnInit, 
  //Inject, 
  //ViewChild, 
  Output, 
  EventEmitter, 
  Input, 
  NgModule,

  Inject
} from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

// import { first } from 'rxjs/operators';
import { UserProfileService } from '../userprofile.service';

import { ModalService } from '../modalServices';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Register2Component } from '../register2/register2.component';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() id: string;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errors: any = [];
  public registerMe:boolean = false;

  @Output() loggedInAsUsernameEvent = new EventEmitter();

  constructor(
    private modalService: ModalService,
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

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {

    // Catch for submission
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) { return; }

    this.loading = true;

    var email = this.f.email.value.toLowerCase();

    this._authService.login({'email': email, 'password': this.f.password.value}).subscribe(
      data => {
        localStorage.setItem('access_token', data['token']);
        localStorage.setItem('loggedInUsername', data['username']);
        this._authService.username = data['username'];

        //Emit
        this.loggedInAsUsernameEvent.emit(data['username']);

        if (data['success']){
          this._authService.emitLoginStausChange();
          this.continueAsMe(data['username']);
          this.closeDialog();
        }
      },
      err => {
        this.loading = false;
//        console.log(err);
        this.errors = err['error'];
      }
    );
  }

  toggleRegister(action?:string) {
    this.registerMe = !this.registerMe;
  }

  public continueAsMe(username?:string){
    // this.router.navigate(['/profile', {username: username}]);
  }

  closeDialog() {
    //if (this.id == null) return;
    //this.modalService.callbackModal(this.id,'FROM CHILD');

    this.loginForm.reset();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginForm.updateValueAndValidity();
    this.loading = false;
    this.submitted = false;
    
    //this.modalService.close(this.id);
    this.dialogRef.close();
  }

  SwitchToRegister = () => {
    this.closeDialog();
    //this.modalService.open('custom-modal-2');
    let d = this.dialog.open(Register2Component, {
      panelClass:"RegisterContainer",
    });
    d.afterClosed().subscribe(result=>{
      //console.log("CLOSED REGISTER", result);
    })
  }

}


/*
export class LoginDialogContent implements OnInit {

  public type: any
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
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<LoginDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {}

   ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]], //Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
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

      var email = this.f.email.value.toLowerCase();

      this._authService.login({'email': email, 'password': this.f.password.value}).subscribe(
        data => {
          localStorage.setItem('access_token', data['token']);
          localStorage.setItem('loggedInUsername', data['username']);
          this._authService.username = data['username'];

          //Emit
          this.loggedInAsUsernameEvent.emit(data['username']);

          if (data['success']){
            this.continueAsMe(data['username']);
            this.closeDialog();
          }
        },
        err => {
          this.loading = false;
          console.log(err);
          this.errors = err['error'];
        }
      );
  }

  toggleRegister(action?:string) {
    this.registerMe = !this.registerMe;
   
  }

  public continueAsMe(username?:string){

    this.router.navigate(['/profile', {username: username}]);

  }

  closeDialog() {
    this.dialogRef.close(LoginDialogContent);
  }

}
*/