import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications.service';
import {Observable} from 'rxjs/Rx';
import { UserProfileService } from '../userprofile.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';

import { ModalService } from '../modalServices';

declare var $: any

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})


export class NavComponent implements OnInit {
  userData: UserData;
  picURL:any;
  navigationOpen : boolean = false;

  constructor(
    private _notificationService:NotificationsService,
    public _authService: AuthService,
    private _userProfileService: UserProfileService,
    private _bottomSheet: MatBottomSheet,
    private modalService: ModalService,
  ) {}

  public notifications:any[] = [];
  public isPurple:Boolean = false;
  public path:any;

  ngOnInit() {
    
    // copy pasta from stack overflow yahooooooo
    $(document).on('click', '.dropdown-menu', function (e) {
      e.stopPropagation();
    });

    try{this.getNotifications();}
    catch{console.log("Couldnt get notifs");}
    

    Observable.interval(60000) // make much larger in production
    .switchMap(() => this._notificationService.getNotifications())
    .subscribe((resp:NotificationResp) => {
      console.log(resp);
      this.notifications = resp.notifications;
      console.log(this.notifications);
    });

    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

    if (localStorage.getItem('loggedInUsername')){
      this._authService.username = localStorage.getItem('loggedInUsername');
      this.getUserPic();
    }
    this.path=window.location.pathname;


  }

  ToggleNavigation() {
    this.navigationOpen = !this.navigationOpen;
    console.log(this.navigationOpen);
  }

  NavItemClick() {
    if (this.navigationOpen) this.ToggleNavigation();
  }

  getNotifications() {

    this._notificationService.getNotifications().toPromise().then((resp:NotificationResp) => {
      console.log(resp);
      this.notifications = resp.notifications;
    });

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

  showNotifications(): void {
    console.log('openming')
    this._bottomSheet.open(NotificationPanelComponent,{data:{notifications:this.notifications}});

    this._bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      console.log('sheet closed');
      this.getNotifications();
    })
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

  openModal(id: string) {
    const data = (id == 'custom-modal-1') ? {register:false}:(id == 'custom-modal-2') ? {register:false} : null;
    this.modalService.open(id, data);
    this.NavItemClick();
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

