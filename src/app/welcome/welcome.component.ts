import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
  AuthService,
  UserProfileService, 
} from '../services';
import {
  UserData,
} from '../interfaces';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit,OnDestroy {
  
  public userData: UserData;
  private userDataSubscription:any = null;
  
  constructor(
    public _authService: AuthService,
    private _userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.userData = this._authService.userData;
    this.userDataSubscription = this._authService.userDataChange.subscribe(this.handleUserDataChange);

  	if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

    if (localStorage.getItem('loggedInUsername')){
      this._authService.username = localStorage.getItem('loggedInUsername');
      /*
      this._userProfileService.requestUserProfile(this._authService.username).then((data) => {
        this.userData = data as UserData;
      });
      */
    }
  }

  ngOnDestroy() {
    this.userData = null;
    if (this.userDataSubscription != null) this.userDataSubscription.unsubscribe();
  }

  handleUserDataChange = (data:UserData) => {
    this.userData = data;
  }

  updateProfile = () => {
    this._userProfileService.requestUserProfile(this._authService.username).then((data) => {
      var d = data as UserData;
      this._authService.updateUserData(d);
    });
  }
}