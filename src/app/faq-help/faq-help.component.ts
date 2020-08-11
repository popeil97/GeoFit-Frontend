import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../userprofile.service';


@Component({
  selector: 'app-faq-help',
  templateUrl: './faq-help.component.html',
  styleUrls: ['./faq-help.component.css']
})
export class FaqHelpComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
   openDialog() {

    const dialogRef = this.dialog.open(FaqHelpDialogContent,{disableClose: false, data:{} as MatDialogConfig});

  }

}

@Component({
  selector: 'app-faq-help-dialog-content',
  templateUrl: './faq-help-dialog-content.html',
})

export class FaqHelpDialogContent {


  constructor(public dialogRef: MatDialogRef<FaqHelpDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
