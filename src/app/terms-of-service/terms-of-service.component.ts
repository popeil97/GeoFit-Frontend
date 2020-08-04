import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.css']
})
export class TermsOfServiceComponent implements OnInit {

  constructor(public dialog: MatDialog, private _authService: AuthService,private route:ActivatedRoute, 
    private router:Router) { }

  ngOnInit() {
  }

  openDialog() {

    const dialogRef = this.dialog.open(TermsOfServiceDialogContent,{disableClose: false, data:{} as MatDialogConfig});

  }

}

@Component({
  selector: 'app-terms-of-service-dialog-content',
  templateUrl: './terms-of-service-dialog-content.html',
})

export class TermsOfServiceDialogContent {


  constructor(public dialogRef: MatDialogRef<TermsOfServiceDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }


}
