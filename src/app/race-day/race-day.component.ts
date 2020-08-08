import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-race-day',
  templateUrl: './race-day.component.html',
  styleUrls: ['./race-day.component.css']
})
export class RaceDayComponent implements OnInit {

  constructor(public dialog: MatDialog, private _authService: AuthService,private route:ActivatedRoute, 
    private router:Router) { }

  ngOnInit() {
  }

  openDialog() {

    const dialogRef = this.dialog.open(RaceDayDialogContent,{disableClose: false, data:{} as MatDialogConfig});

  }

}

@Component({
  selector: 'app-race-day-dialog-content',
  templateUrl: './race-day-dialog-content.html',
})

export class RaceDayDialogContent {


  constructor(public dialogRef: MatDialogRef<RaceDayDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }


}
