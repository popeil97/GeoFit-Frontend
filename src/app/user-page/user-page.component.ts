import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../userprofile.service';
import { AuthService } from '../auth.service';
import { RaceService } from '../race.service';
import { UsersService } from '../users.service';
import { ModalService } from '../modalServices';
import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  username;
  userData: UserData;
  public userRaces:any[];
  public racesData:any;
  showEdit: boolean;

  public followersData: any = {
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
    private modalService: ModalService,
  ) {}

  public currentScreen = 'home';
  public acceptedScreens = ['home','stats','feed','races'];

  ngOnInit() {
    //Don't show edit page by default
    this.showEdit = false;

    this.route.paramMap.subscribe(params => {
      //console.log('User Page - params',params);
      this.username = (params['params']['username'] != null) ? params['params']['username'] : this._authService.username;
      this.getUserData();
    //   console.log(this.username);
    });

    this.raceService.getRaces({}).subscribe(
      data => {
        this.racesData = data;
        this.userRaces = _.filter(this.racesData.races,(race:any) => {
          if(race.joined) {
            return race;
          }
        });
       //  console.log("USER RACES PROFILE", this.userRaces);
      }
    )

    document.getElementById('home-btn').style.backgroundColor = "#36343c";
     document.getElementById('home-btn').style.color = "#FFFFFF";

  }

  ngOnChanges(changes: SimpleChanges) {
   //  console.log('changes:',changes);

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

  getUserData() {
    //Call a to-be-created service which gets user data, feed, statistics etc
  //   console.log('user-page - getUserData()',this.username);
    this._userProfileService.getUserProfile(this.username).then((data) => {
      this.userData = data as UserData;
      
      console.log("New user data profPage: ", this.userData);
      
      if (this.userData.location == "") {
        this.userData.location = "N/A";
      }
      if (this.userData.description == "") {
        this.userData.description = "N/A";
      }

      this._userService.getFollowersAndFollowedSeperate().then((resp:FollowersResp) => {
        this.followersData.followers = resp.followers;
        this.followersData.followed = resp.followed;
        this.followersData.numFollowers = this.followersData.followers.length;
        this.followersData.numFollowing = this.followersData.followed.length;
      });

    });
  }

  openFollowersDialog = () => {
    const data = {
      username:this.username,
      followersData: this.followersData,
    }
    this.modalService.open('followersModal',data);
  }

  logout() {
    this._authService.logout();
  }
  toggleEditView(): void{
    this.showEdit = !this.showEdit;
   //  console.log("EDIT .", this.showEdit);
  }

  viewRace(race:any) {
  //   console.log('SELECTED RACE:',race);

    // set race in race service

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

  openModal(id: string) {
   
    var data = (id == 'profileModal') ? {userData:this.userData, callbackFunction:null} : {};
    console.log("DATA SENT TO CHILD", data);
    data.callbackFunction = this.updateProfile;
    this.modalService.open(id,data);
  }

  updateProfile = (incomingData = null) => {
    if(incomingData != null){
      this.profileUpdated(null);
      this.closeModal('profileModal');
    }
    
  }

  closeModal(id: string) {
      this.modalService.close(id);
      console.log(this.modalService.getModalData(id));
  }

  SwitchSlideshow = (to:string = null) => {
    if (to == null || this.acceptedScreens.indexOf(to) == -1) return;
    this.currentScreen = to;

     document.getElementById(to+'-btn').style.backgroundColor = "#36343c";
     document.getElementById(to+'-btn').style.color = "#FFFFFF";

    switch(to) { 
     case 'home': { 
     //  document.getElementById('races-btn').style.backgroundColor = "#FFFFFF";
     //  document.getElementById('races-btn').style.color = "#000000";
       document.getElementById('feed-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('feed-btn').style.color = "#000000";
       document.getElementById('stats-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('stats-btn').style.color = "#000000";
        break; 
     } 
     case 'stats': { 
    //   document.getElementById('races-btn').style.backgroundColor = "#FFFFFF";
     //  document.getElementById('races-btn').style.color = "#000000";
       document.getElementById('feed-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('feed-btn').style.color = "#000000";
       document.getElementById('home-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('home-btn').style.color = "#000000";
        break; 
     } 
     case 'feed': { 
        document.getElementById('stats-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('stats-btn').style.color = "#000000";
     //  document.getElementById('races-btn').style.backgroundColor = "#FFFFFF";
      // document.getElementById('races-btn').style.color = "#000000";
       document.getElementById('home-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('home-btn').style.color = "#000000";
        break; 
     } 
     case 'races': { 
         document.getElementById('stats-btn').style.backgroundColor = "#FFFFFF";
         document.getElementById('stats-btn').style.color = "#000000";
         document.getElementById('feed-btn').style.backgroundColor = "#FFFFFF";
          document.getElementById('feed-btn').style.color = "#000000";
          document.getElementById('home-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('home-btn').style.color = "#000000";
        break; 
     } 
     default: { 
        break; 
     } 
   }

    return;
  }

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
  location_visibility:boolean;
  about_visibility:boolean;
  email_visibility:boolean;
}

interface FollowersResp {
  followed: any[];
  followers:any[];
}