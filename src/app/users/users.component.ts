import { Component, OnInit } from '@angular/core';
import {UserService} from './users.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  /**
   * An object representing the user for the login form
   */
  public user: any;
  public isLoggedIn: Boolean;

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: ''
    };

    //If we already store a JWT locally, set it in memory
    if (localStorage.getItem('access_token')){
      this._userService.token = localStorage.getItem('access_token');
    }

    if (this._userService.token){
      this.isLoggedIn = true;
    }

  }


  // register() {
  //   this._userService.register({'username': this.user.username, 'password': this.user.password});
  // }

  // login() {
  //   this._userService.login({'username': this.user.username, 'password': this.user.password});
  //   this.isLoggedIn = true;
  // }

  // refreshToken() {
  //   this._userService.refreshToken();
  // }

  logout() {
    this._userService.logout();
    this.isLoggedIn = false;
  }




}



