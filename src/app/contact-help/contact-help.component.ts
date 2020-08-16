import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../userprofile.service';


@Component({
  selector: 'app-contact-help',
  templateUrl: './contact-help.component.html',
  styleUrls: ['./contact-help.component.css']
})
export class ContactHelpComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
   openDialog() {

    const dialogRef = this.dialog.open(ContactHelpDialogContent,{disableClose: false, data:{} as MatDialogConfig});

  }

}

@Component({
  selector: 'app-contact-help-dialog-content',
  templateUrl: './contact-help-dialog-content.html',
})

export class ContactHelpDialogContent {


  constructor(public dialogRef: MatDialogRef<ContactHelpDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
