import { Component, NgModule } from '@angular/core'
import { MatDialogRef } from '@angular/material';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-race-type',
  templateUrl: './race-type.component.html',
  styleUrls: ['./race-type.component.css']
})
export class RaceTypeComponent {
  constructor(
    public dialogRef : MatDialogRef<RaceTypeComponent>,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
