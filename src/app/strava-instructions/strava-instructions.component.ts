import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../userprofile.service'

@Component({
  selector: 'app-strava-instructions',
  templateUrl: './strava-instructions.component.html',
  styleUrls: ['./strava-instructions.component.css']
})
export class StravaInstructionsComponent implements OnInit {

  public fale:any;

  constructor() { }

  ngOnInit() {
  }

}
