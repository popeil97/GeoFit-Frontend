import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

interface DialogData {
  price:string,
  isLoggedIn:Boolean,
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(SignupDialogContent,{data:{price:'5.00',isLoggedIn:false} as MatDialogConfig});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
  }

}


@Component({
  selector: 'signup-dialog-content',
  templateUrl: 'signup-dialog-content.html',
})
export class SignupDialogContent {

  isLoggedIn:Boolean = false;
  price:string = '';
  isSuccess:Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SignupDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
      this.isLoggedIn = data.isLoggedIn;
      this.price = data.price;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stepCallback(success:Boolean): void {

  }

}