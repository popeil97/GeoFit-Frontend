import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications.service';
import {Observable} from 'rxjs/Rx';
import { UserProfileService, UserData } from '../userprofile.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalService } from '../modalServices';
import { MatDialog } from '@angular/material';

import { LoginComponent } from '../login/login.component';
import { Register2Component } from '../register2/register2.component';

declare var $: any

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})


export class NavComponent implements OnInit, OnDestroy {
  
  userData: UserData;
  picURL:any;
  navigationOpen : boolean = false;
  profileOpen : boolean = false;

  private loggedInStatusSubscription:any = null;
  private openedBottomSheetRefSubscription:any = null;
  private notificationSubscription:any = null;

  constructor(
    private _notificationService:NotificationsService,
    public _authService: AuthService,
    private _userProfileService: UserProfileService,
    private _bottomSheet: MatBottomSheet,
    private router:Router,
    private modalService: ModalService,

    private dialog : MatDialog
  ) {}

  public notifications:any[] = [];
  public isPurple:Boolean = false;
  public path:any;

  ngOnInit() {
    // copy pasta from stack overflow yahooooooo
    $(document).on('click', '.dropdown-menu', function (e) {
      e.stopPropagation();
    });

    this.loggedInStatusSubscription = this._authService.getLoginStatus.subscribe(this.handleLoginChange);

    var ua = window.navigator.userAgent;
    var iOS = !!ua.match(/iP(ad|od|hone)/i);
    var webkit = !!ua.match(/WebKit/i);
    var iOSSafari = 
      iOS && 
      webkit && 
      !ua.match(/CriOS/i) 
      && !ua.match(/OPiOS/i) 
      && !ua.match(/EdgiOS/i);
    
    if (iOSSafari) {
      document.getElementById('NavLoginButtons').classList.add('safariBrowser');
    }


    // THIS SHOULDN'T BE THE WAY, BUT LET'S GO WITH IT FOR NOW
    this.notificationSubscription = Observable.interval(1*1000) // make much larger in production
      .switchMap(() => {
        if (!this._authService.isLoggedIn()) return [];
        return this._notificationService.getNotifications();
      })
      .subscribe((resp:NotificationResp) => {
        //console.log(resp);
        this.notifications = resp.notifications;
        //console.log(this.notifications);
      });
    
    if (localStorage.getItem('access_token')){
        this._authService.token = localStorage.getItem('access_token');
    }
  
    if (localStorage.getItem('loggedInUsername')){
        this._authService.username = localStorage.getItem('loggedInUsername');
        this.getUserPic();
    }
    this.path=window.location.pathname;
    
    /*
    try{this.getNotifications();}
    catch{console.log("Couldnt get notifs");}
  
    /*
    Observable.interval(60000) // make much larger in production
      .switchMap(() => this._notificationService.getNotifications())
      .subscribe((resp:NotificationResp) => {
        //console.log(resp);
        this.notifications = resp.notifications;
        //console.log(this.notifications);
      });

    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

    if (localStorage.getItem('loggedInUsername')){
      this._authService.username = localStorage.getItem('loggedInUsername');
      this.getUserPic();
    }
    this.path=window.location.pathname;
    */
  }

  ngOnDestroy() {
    if (this.loggedInStatusSubscription) this.loggedInStatusSubscription.unsubscribe();
    if (this.notificationSubscription) this.notificationSubscription.unsubscribe();
    if (this.openedBottomSheetRefSubscription) this.openedBottomSheetRefSubscription.unsubscribe();

    this.picURL = null;
  }

  handleLoginChange(loggedIn:Boolean) {
    if (loggedIn) {
      this.getUserPic();
    } 
    else {
      this.picURL = null;
    }
  }

  ToggleNavigation() {
    this.navigationOpen = !this.navigationOpen;
    if (!this.navigationOpen) {
      this.profileOpen = false;
    }
  }

  ToggleProfileDropdown() {
    console.log("Profile dropdown currently set to: " + this.profileOpen);
    this.profileOpen = !this.profileOpen;
    console.log("Profile dropdown now set to: " + this.profileOpen);
  }

  NavItemClick(url:string = null) {
    if (this.navigationOpen) this.ToggleNavigation();
    if (url != null) this.router.navigate([url]);
  }
  NavDropdownItemClick = (url:any = null) => {
    this.ToggleProfileDropdown();
    this.ToggleNavigation();
    this.NavItemClick(url);
  }

  getNotifications() {
    this._notificationService.getNotifications().toPromise().then((resp:NotificationResp) => {
      //console.log(resp);
      this.notifications = resp.notifications;
    }).catch(err=>{
      console.error('GET NOTIFICATIONS ERROR:',err)
      throw(err);
    })

  }

   getUserPic(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.requestUserProfile(this._authService.username).then((data) => {
      console.log("RETRIEVED USER DATA",data);
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
    //console.log('openming')
    this._bottomSheet.open(NotificationPanelComponent,{data:{notifications:this.notifications}});

    this.openedBottomSheetRefSubscription = this._bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      //console.log('sheet closed');
      this.getNotifications();
    })
  }

  NavDropdownLogout = () => {
    this.NavDropdownItemClick();
    this.logout();
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

  openLogin() {
    const d = this.dialog.open(LoginComponent, {
      panelClass: 'LoginContainer'
    });
    const sub = d.componentInstance.openRegister.subscribe(()=>{
      this.openRegister();
    })
    d.afterClosed().subscribe(result=>{
      console.log('Closing Login from Nav')
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    })
  }
  openRegister() {
    const d = this.dialog.open(Register2Component, {
      panelClass: 'RegisterContainer'
    });
    const sub = d.componentInstance.openLogin.subscribe(() => {
      this.openLogin();
    });
    d.afterClosed().subscribe(result=>{
      console.log("Closing Register from Nav");
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    });
  }

}



interface NotificationResp {
  notifications:any[];
}

