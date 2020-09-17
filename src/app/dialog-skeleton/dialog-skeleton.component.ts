import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
types:
1- signup
2- register
**/
@Component({
  selector: 'app-dialog-skeleton',
  templateUrl: './dialog-skeleton.component.html',
  styleUrls: ['./dialog-skeleton.component.css']
})
export class DialogSkeletonComponent implements OnInit {
  @Input() type;
  items = [];

  constructor(public dialog: MatDialog, private _authService: AuthService,private route:ActivatedRoute, 
    private router:Router) { }

  ngOnInit() {
  	console.log("TYPE", this.type);
  }

  openDialog() {

    const dialogRef = this.dialog.open(DialogSkeletonDialogContent,{disableClose: false, data:{type: this.type} as MatDialogConfig});

  }


}


@Component({
  selector: 'app-dialog-skeleton-dialog-content',
  templateUrl: './dialog-skeleton-dialog-content.html',
})

export class DialogSkeletonDialogContent {

	public type: any
  constructor(public dialogRef: MatDialogRef<DialogSkeletonDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }


}