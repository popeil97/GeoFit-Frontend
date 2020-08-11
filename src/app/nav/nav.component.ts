import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications.service';
import {Observable} from 'rxjs/Rx';
import { UserProfileService } from '../userprofile.service';

declare var $: any

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})


export class NavComponent implements OnInit {

userData: UserData;
picURL:any;

  constructor(private _notificationService:NotificationsService,
              public _authService: AuthService,
              private _userProfileService: UserProfileService) { }

  public notifications:any[];
  public isPurple:Boolean = false;
  public path:any;

  ngOnInit() {
    
    // copy pasta from stack overflow yahooooooo
    $(document).on('click', '.dropdown-menu', function (e) {
      e.stopPropagation();
    });

    Observable.interval(120000) // make much larger in production
    .switchMap(() => this._notificationService.getNotifications())
    .subscribe((resp:NotificationResp) => {
      console.log(resp);
      this.notifications = resp.notifications;
    });

    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

    if (localStorage.getItem('loggedInUsername')){
      this._authService.username = localStorage.getItem('loggedInUsername');
      this.getUserPic();
    }
    this.path=window.location.pathname;

    if(this.path == "/")
    {
      this.isPurple = false;
    }
    else
    {
      this.isPurple = true;
    }
  }

   getUserPic(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.getUserProfile(this._authService.username).then((data) => {
      this.userData = data as UserData;
      this.picURL = this.userData.profile_url;
    });
  }

  goToMyProfile(){
    this._userProfileService.goToUserProfile(this._authService.username);
  }

  setLoggedInUsername(username: string){
    this._authService.username = username;
  }


  removeNotification(not_id:number) {
    this.notifications = this.notifications.filter((notification) => {
      return not_id != notification.not_id;
    });
  }

  logout() {
    this._authService.logout();
  }

  purpleTrue(action?:string) {
    this.isPurple = true;
   
  }

  purpleFalse(action?:string) {
    this.isPurple = false;
   
  }

  getPath(action?:string){
    this.path = window.location.pathname;
  }

}



interface NotificationResp {
  notifications:any[];
}

interface UserData {
  user_id:number;
  profile_url:string;
  email:string;
  description: string;
  location:string;
  first_name:string;
  last_name:string;
  follows:boolean;
  distance_type: string;
  is_me: boolean;
}

