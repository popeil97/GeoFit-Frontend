import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../userprofile.service'

@Component({
  selector: 'app-manual-instructions',
  templateUrl: './manual-instructions.component.html',
  styleUrls: ['./manual-instructions.component.css']
})
export class ManualInstructionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}

