import { NgModule, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@NgModule({
  entryComponents:[MatDialogRef]
})

@Component({
  selector: 'app-inactive-state-explanation-popup',
  templateUrl: './inactive-state-explanation-popup.component.html',
  styleUrls: ['./inactive-state-explanation-popup.component.css']
})
export class InactiveStateExplanationPopupComponent {

  constructor(
    private dialogRef:MatDialogRef<InactiveStateExplanationPopupComponent>,
  ) {}

  closeDialog = () => {
    this.dialogRef.close();
  }

}
