import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
    let d = this.dialog.open(LoginComponent, {
      panelClass:"LoginContainer",
    });
    d.afterClosed().subscribe(result=>{
      console.log("CLOSING LOGIN FROM LANDING", result);
    });
  }

  openRegister = () => {
    let d = this.dialog.open(Register2Component,{
      panelClass:"RegisterContainer",
    });
    d.afterClosed().subscribe(result=>{
      console.log('CLOSING REGISTER FROM LANDING', result);
    })
  }

/**
* Template Name: Mamba - v2.3.0
* Template URL: https://bootstrapmade.com/mamba-one-page-bootstrap-template-free/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

}
