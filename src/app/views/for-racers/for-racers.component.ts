import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../auth.service';

import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-for-racers',
  templateUrl: './for-racers.component.html',
  styleUrls: ['./for-racers.component.css']
})
export class ForRacersComponent implements OnInit {

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
    const d = this.dialog.open(LoginComponent,{
      panelClass:"LoginContainer",
    });
    const sub = d.componentInstance.openRegister.subscribe(()=>{
      this.openRegister();
    })
    d.afterClosed().subscribe(result=>{
      console.log("Closing Login from For Racers");
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    })
  }

  openRegister = () => {
    const d = this.dialog.open(RegisterComponent, {
      panelClass: 'RegisterContainer',
      data:{register:false},
    });
    const sub = d.componentInstance.openLogin.subscribe(() => {
      this.openLogin();
    });
    d.afterClosed().subscribe(result=>{
      console.log("Closing Register from For Racers");
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    });
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
