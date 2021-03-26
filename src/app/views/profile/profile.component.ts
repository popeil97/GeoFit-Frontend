import { Component, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { 
  AuthService,
  RaceService,
  UserProfileService,
  UsersService,
} from '../../services';

import {
  UserData,
} from '../../interfaces'

import {
  ProfileFormComponent,
  ViewFollowComponent,
} from '../../popups';

import * as _ from 'lodash';
import { timeStamp } from 'console';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy {

  username;
  userData: UserData;
  private userDataSubscription:any = null;
  
  public loading: boolean = true;
  public showEdit: boolean = false;
  public viewingElse: boolean = false;

  public userRaces:any[];
  public racesData:any;

  public followersData: any = {
    loading:true,
    valid:false,
    followers:[],
    followed: [],
    follow_bool:[],
    numFollowers:0,
    numFollowing:0,
  }

  constructor(
    private route:ActivatedRoute, 
    private router:Router,
    private _userProfileService:UserProfileService,
    private _userService:UsersService,
    public _authService: AuthService,
    private raceService: RaceService,

    private dialog : MatDialog,
  ) {}

  public currentScreen = 'home';
  public acceptedScreens = ['home','stats','feed','races'];

  ngOnInit() {
    this.initializePage();
  }

  ngOnChanges(changes: SimpleChanges) {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'username':
            if(changes.username.currentValue != undefined) {
              this.getUserData();
            }
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.userDataSubscription) this.userDataSubscription.unsubscribe();
    this.userData = null;
    this.followersData = null;
  }

  handleUserDataChange = (data:UserData) => {
    this.userData = data;
    if (this.userData != null) {
      this.processUserData(()=>{
        this.getUserRaces();
      });
    }
  }

  getLoadingStatus() {
    return this.loading;
  }

  getValidSessionStatus() {
    var valid;
    // We should always return true if we're viewing someone else's profile
    if (this.viewingElse) valid = (this.userData != null);
    // Otherwise, we return if we're logged in (which should be valid)
    else valid = (this.userData != null && this._authService.isLoggedIn());
    return valid;
  }

  initializePage = ():void => {
    // Initial states:
    //  - loading is set to TRUE
    //  - showEdit is set to FALSE
    //  - viewingElse is set to FALSE

    // For now, we have to adjust the page contents depending on if we're accessing someone else's user page or our own.
    // We store that info inside of the local "username" variable.
    this.route.paramMap.subscribe(params => {
      if (params['params']['username'] != null) {
        // We first need to check if we're looking at someone else's profile
        console.log('USERNAME IN URL');
        this.username = params['params']['username'];
        this.viewingElse = true;

        // If we are, then we need to get their user data
        this.getUserData(()=>{
          this.getUserRaces();
        });
      } 
      else if (this._authService.isLoggedIn()) {
        // If we can't find a username in the URL, we're probably looking at ourselves, right?
        console.log("WE'RE LOOKING AT OURSELVES");
        this.username = this._authService.username;
        this.viewingElse = false;

        // If so, then we already are storing our user data inside of _authService.
        // We just need to reference that and listen for any changes
        this.userData = this._authService.userData;
        this.userDataSubscription = this._authService.userDataChange.subscribe(this.handleUserDataChange);
        if (this.userData != null) this.processUserData(()=>{
          this.getUserRaces();
        });
      } 
      // Truly, there is no cause. We're not logged in...
      else {
        console.log("... We don't have any username")
        this.username = null;
        this.viewingElse = false;

        this.userData = null;
        this.loading = false;
      }
    });
  }

  getUserRaces() {
    // Updates the list of races associated with the user who's profile we are viewing
    this.raceService.getRaces(this.userData.user_id).subscribe(
      data => {
        console.log('RACES:',data)
        this.racesData = data;
        this.userRaces = _.filter(this.racesData.races,(race:any) => {
          if(race.joined) {
            return race;
          }
        });
      }
    )
  }

  getUserData = (callback:any = null):void => {

    //Call a to-be-created service which gets user data, feed, statistics etc
    if (this.username == null) {
      this.loading = false;
      this.userData = null;
      return;
    }

    this.loading = true;
    this.userData = null;

    this._userProfileService.requestUserProfile(this.username).then((data) => {
      this.userData = data as UserData;
      console.log("New user data profPage: ", this.userData);
      this.processUserData(callback);
    });
  }

  processUserData = (callback:any = null):void => {
    if (this.userData.location == "") this.userData.location = "N/A";
    if (this.userData.description == "") this.userData.description = "N/A";

    if (this._authService.isLoggedIn()) {
      this._userService.getFollowersAndFollowedSeperate().then((resp:FollowersResp) => {
        this.followersData.followers = resp.followers;
        this.followersData.followed = resp.followed;
        this.followersData.numFollowers = this.followersData.followers.length;
        this.followersData.numFollowing = this.followersData.followed.length;
        this.followersData.loading = false;
        this.followersData.valid = true;
      });
    } else {
      this.followersData.loading = false;
      this.followersData.valid = false;
    }

    this.loading = false;
    if (callback) callback();
  }

  openFollowersDialog = () => {
    const data = {
      username:this.username,
      followersData: this.followersData,
    }
    this.dialog.open(ViewFollowComponent,{
      panelClass:"ViewFollowersContainer",
      data:data,
    });
  }

  logout() {
    this._authService.logout();
    this.getUserData();
  }
  toggleEditView(): void{
    this.showEdit = !this.showEdit;
  }

  viewRace(race:any) {
    this.router.navigate(['/race',{name:race.name,id:race.id}]);
  }

  viewAbout(race:any) {
    this.router.navigate(['/about',{name:race.name,id:race.id}]);
  }

  profileUpdated($event) {
    //Get new data
    this.getUserData();

    //Switch back to main view
    //this.toggleEditView();
  }

  openProfileForm = ():void => {
    this.dialog.open(ProfileFormComponent,{
      panelClass:"DialogDefaultContainer",
      data:this.userData,
    }).afterClosed().subscribe(isChanged=>{
      if (isChanged) this.getUserData(()=>{
        this._authService.updateUserData(this.userData);
      });
    })
  }

  SwitchSlideshow = (to:string = null) => {
    if (to == null || this.acceptedScreens.indexOf(to) == -1) return;
    this.currentScreen = to;

     document.getElementById(to+'-btn').style.backgroundColor = "#36343c";
     document.getElementById(to+'-btn').style.color = "#FFFFFF";

    switch(to) { 
      case 'home':
        document.getElementById('races-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('races-btn').style.color = "#000000";
        document.getElementById('feed-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('feed-btn').style.color = "#000000";
        //  document.getElementById('stats-btn').style.backgroundColor = "#FFFFFF";
        //  document.getElementById('stats-btn').style.color = "#000000";
        break; 
      case 'stats':
        document.getElementById('races-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('races-btn').style.color = "#000000";
        // document.getElementById('feed-btn').style.backgroundColor = "#FFFFFF";
        // document.getElementById('feed-btn').style.color = "#000000";
        document.getElementById('home-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('home-btn').style.color = "#000000";
        break;  
      case 'feed':
        // document.getElementById('stats-btn').style.backgroundColor = "#FFFFFF";
        // document.getElementById('stats-btn').style.color = "#000000";
        document.getElementById('races-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('races-btn').style.color = "#000000";
        document.getElementById('home-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('home-btn').style.color = "#000000";
        break; 
     case 'races':
        // document.getElementById('stats-btn').style.backgroundColor = "#FFFFFF";
        // document.getElementById('stats-btn').style.color = "#000000";
        document.getElementById('feed-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('feed-btn').style.color = "#000000";
        document.getElementById('home-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('home-btn').style.color = "#000000";
        break; 
    }
  }

}


interface FollowersResp {
  followed: any[];
  followers:any[];
}