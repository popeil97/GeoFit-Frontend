import { Component, } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { 
  TermsOfServiceComponent 
} from '../../popups';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent {

  constructor(
    public router : Router,
    public dialog : MatDialog,
  ) {}

  navigateTo = (url:string = null) => {
    if (url == null) return;
    this.router.navigate([url]);
    window.scrollTo(0, 0);
  }

  openTOS = () => {
    this.dialog.open(TermsOfServiceComponent, {
      panelClass:'DialogDefaultContainer',
    });
  }

}
