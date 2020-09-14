import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(public _authService: AuthService) { }

  ngOnInit() {

  	if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

    if (localStorage.getItem('loggedInUsername')){
      this._authService.username = localStorage.getItem('loggedInUsername');
    }

  }

}
