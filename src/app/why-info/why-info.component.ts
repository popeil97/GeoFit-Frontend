import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-why-info',
  templateUrl: './why-info.component.html',
  styleUrls: ['./why-info.component.css']
})
export class WhyInfoComponent implements OnInit {

  constructor(public dialog: MatDialog, private _authService: AuthService,private route:ActivatedRoute, 
    private router:Router) { }

  ngOnInit() {
  }

  openDialog() {

    const dialogRef = this.dialog.open(WhyInfoDialogContent,{disableClose: false, data:{} as MatDialogConfig});

  }

}

@Component({
  selector: 'app-why-info-dialog-content',
  templateUrl: './why-info-dialog-content.html',
})

export class WhyInfoDialogContent {


  constructor(public dialogRef: MatDialogRef<WhyInfoDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }


}
