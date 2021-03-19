import { Component, NgModule, } from '@angular/core';
import { MatDialogRef, } from '@angular/material';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.css']
})
export class RouteInfoComponent {

  constructor(
    private dialogRef:MatDialogRef<RouteInfoComponent>,
  ) {}

  closeDialog = () => {
   this.dialogRef.close();
  }

}
