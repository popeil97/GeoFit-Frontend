import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
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

  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: ''
    };

    //If we already store a JWT locally, set it in memory
    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

  }

  logout() {
    this._authService.logout();
  }




}



