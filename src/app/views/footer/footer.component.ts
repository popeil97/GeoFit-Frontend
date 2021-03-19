import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TermsOfServiceDialogContent } from '../../terms-of-service/terms-of-service.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    public router : Router,
    public dialog : MatDialog,
  ) { }

  ngOnInit() {
  }

  navigateTo = (url:string = null) => {
    if (url == null) return;
    this.router.navigate([url]);
    window.scrollTo(0, 0);
  }

  openTOS = () => {
    let d = this.dialog.open(TermsOfServiceDialogContent, {
      panelClass:'TOSContainer',
    });
    d.afterClosed().subscribe(result=>{
      console.log('CLOSED TOS FROM FOOTER', result);
    })
  }

}
