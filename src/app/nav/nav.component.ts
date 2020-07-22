import { Component, OnInit } from '@angular/core';
import {UserService} from '../users/users.service';
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

  constructor(private _notificationService:NotificationsService,
              private _userService: UserService,
              private _userProfileService: UserProfileService) { }

  public notifications:any[];
  public isLoggedIn: Boolean;

  ngOnInit() {
    // copy pasta from stack overflow yahooooooo
    $(document).on('click', '.dropdown-menu', function (e) {
      e.stopPropagation();
    });

    Observable.interval(5000) // make much larger in production
    .switchMap(() => this._notificationService.getNotifications())
    .subscribe((resp:NotificationResp) => {
      console.log(resp);
      this.notifications = resp.notifications;
    });

    if (localStorage.getItem('access_token')){
      this._userService.token = localStorage.getItem('access_token');
    }

    if (localStorage.getItem('loggedInUsername')){
      this._userService.username = localStorage.getItem('loggedInUsername');
    }

    if (this._userService.token){
      this.isLoggedIn = true;
    }

  }

  goToMyProfile(){
    this._userProfileService.goToUserProfile(this._userService.username);
  }

  setLoggedInUsername(username: string){
    this._userService.username = username;

    //Perform login actions
    this.isLoggedIn = true;
  }


  removeNotification(not_id:number) {
    this.notifications = this.notifications.filter((notification) => {
      return not_id != notification.not_id;
    });
  }

  logout() {
    this._userService.logout();
    this.isLoggedIn = false;
  }

}



interface NotificationResp {
  notifications:any[];
}
