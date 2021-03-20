import { NgModule, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-why-birthday',
  templateUrl: './why-birthday.component.html',
  styleUrls: ['./why-birthday.component.css']
})

export class WhyBirthdayComponent {
  constructor(
    private dialogRef: MatDialogRef<WhyBirthdayComponent>
  ) {}

  closeDialog = () => {
    this.dialogRef.close();
  }
}
