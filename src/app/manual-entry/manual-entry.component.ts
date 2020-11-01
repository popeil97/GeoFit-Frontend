import { Component, OnInit, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../modalServices';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar'
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.css']
})
export class ManualEntryComponent implements OnInit {

  manualEntryForm:FormGroup;
 // @Input() id: string;
  @Input() race_type:number;
  @Output() uploadManualEntry: EventEmitter<any> = new EventEmitter();
  activityOptions:any[];
  defaultActivityString:string;

  submitted = false;

  constructor( private modalService: ModalService,private _snackbar:MatSnackBar,) { 
    
  }

  ngOnInit() {
   // console.log("RACE TYPE", this.race_type);
   this.submitted = false;
    this.defaultActivityString = "Run";
    if(this.race_type==1) //run/walk
    {
      this.activityOptions = ['Run', 'Walk'];
    }
    if(this.race_type==2) // bike
    {
      this.defaultActivityString = "Ride";
      this.activityOptions = ['Ride'];
    }
    if(this.race_type==3) //all
    {
      this.activityOptions = ['Run', 'Walk', 'Ride', 'Other'];
    }

    

    this.manualEntryForm = new FormGroup({
      activityType: new FormControl(this.defaultActivityString,[
        Validators.required,
        Validators.maxLength(30)
      ]),
      distance: new FormControl('',[
        Validators.required
      ]),
     // distanceType: new FormControl('',[
     //   Validators.required
    //  ]),
      activityDate: new FormControl('', [
        Validators.required
        ]),
      hours: new FormControl(0,[
        Validators.required
      ]),
      minutes: new FormControl(0,[
        Validators.required
      ]),
      seconds: new FormControl(0,[
        Validators.required
      ])
    });



 //   this.manualEntryForm.get('distanceType').setValue('MI');
  }

  closeModal(id: string) {
    this.modalService.close(id);
    console.log(this.modalService.getModalData(id));

 //   this._snackbar.openFromComponent(SnackbarComponent,{duration: 5000,horizontalPosition: 'left',
   //   verticalPosition: 'bottom',data:{message:'Your activity has been applied!'}});
  }

  upload(): void {
    this.modalService.callbackModal("custom-modal-5",null);
    let formClean = this.manualEntryForm.value as any;
   // console.log(this.manualEntryForm);
    let isValid: Boolean = this.manualEntryForm.valid;

    if(isValid) {
      formClean.distanceType = DistanceType['MI'];

      this.manualEntryForm.reset();

      this.uploadManualEntry.emit(formClean);
    }
     this.defaultActivityString = "Run";
      if(this.race_type==2) // bike
      {
        this.defaultActivityString = "Ride";
      }
 //   this.manualEntryForm.get('distanceType').setValue('MI');
    this.manualEntryForm.get('activityType').setValue(this.defaultActivityString);
    this.manualEntryForm.get('hours').setValue(0);
    this.manualEntryForm.get('minutes').setValue(0);
    this.manualEntryForm.get('seconds').setValue(0);
    this.submitted = true;
    this.closeModal('custom-modal-5');
  }

  parseDistanceType(entry:any) {
   // console.log('VALUE:',entry.value);
    let value = entry.value;
 //   this.manualEntryForm.get('distanceType').setValue(DistanceType[value])
  }

  get f() { return this.manualEntryForm.controls; }

  

}

export enum DistanceType {
  MI=1,
  KM=2
}
