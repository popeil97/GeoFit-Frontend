import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../auth.service';

import { MatDialog } from '@angular/material';
import { LoginComponent } from '../../login/login.component';
import { Register2Component } from '../../register2/register2.component';

@Component({
  selector: 'app-for-race-creators',
  templateUrl: './for-race-creators.component.html',
  styleUrls: ['./for-race-creators.component.css']
})
export class ForRaceCreatorsComponent implements OnInit {

  constructor(
    public _authService: AuthService, 
    public router : Router,
    public dialog : MatDialog,
  ) { }

  ngOnInit() {
    //If we already store a JWT locally, set it in memory
    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }
  }

  logout() {
    this._authService.logout();
  }

  openLogin = () => {
    let d = this.dialog.open(LoginComponent,{
      panelClass:"LoginContainer",
      data:{register:false}
    });
    d.afterClosed().subscribe(result=>{
      console.log("CLOSE LOGIN FROM to_race_creators", result);
    })
  }

  openRegister = () => {
    let d = this.dialog.open(Register2Component, {
      panelClass:"RegisterContainer",
      data:{register:false},
    });
    d.afterClosed().subscribe(result=>{
      console.log("CLOSE REGISTER FROM to_race_creators", result);
    })
  }

  navigateTo(url:string = null) {
    if (url != null) this.router.navigate([url]);
  }
  scrollToElement = (id : string) => {
    const el = document.getElementById(id);
    if (el) {
      var headerOffset = 64;
      var elementPosition = el.offsetTop;
      var offsetPosition = elementPosition - headerOffset;
      document.documentElement.scrollTop = offsetPosition;
      document.body.scrollTop = offsetPosition; // For Safari
      //el.scrollIntoView();
    }
  }

}
