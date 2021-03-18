import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import {AuthService} from '../../auth.service';
import {throwError} from 'rxjs';
import $ from "jquery";

import { LoginComponent } from '../../login/login.component';
import { Register2Component } from '../../register2/register2.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  private testString = "From Parent";

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
    console.log(this._authService.isLoggedIn());

  }

  logout() {
    this._authService.logout();
  }

  openLogin = () => {
    const d = this.dialog.open(LoginComponent, {
      panelClass:"LoginContainer",
    });
    const sub = d.componentInstance.openRegister.subscribe(()=>{
      this.openRegister();
    })
    d.afterClosed().subscribe(result=>{
      console.log("Closing login from Landing");
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    });
  }

  openRegister = () => {
    const d = this.dialog.open(Register2Component, {
      panelClass: 'RegisterContainer',
    });
    const sub = d.componentInstance.openLogin.subscribe(() => {
      this.openLogin();
    });
    d.afterClosed().subscribe(result=>{
      console.log("Closing Register from Landing Page")
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    });
  }

  goToUserProfile = () => {
    this.router.navigate(['/profile']);
  }

/**
* Template Name: Mamba - v2.3.0
* Template URL: https://bootstrapmade.com/mamba-one-page-bootstrap-template-free/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

}
