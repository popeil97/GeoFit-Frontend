import { NgModule, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.css']
})

export class TermsOfServiceComponent {

  constructor(
    private router:Router,
    public dialogRef: MatDialogRef<TermsOfServiceComponent>,
  ) {}

  navigateTo = (url:string = null) => {
    if (url != null) this.router.navigate([url]);
    this.closeDialog();
  }

  closeDialog = () => {
    this.dialogRef.close();
  }

}
