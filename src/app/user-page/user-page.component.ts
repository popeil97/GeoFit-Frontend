import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../userprofile.service';
import { AuthService } from '../auth.service';
import { RaceService } from '../race.service';
import { UsersService } from '../users.service';
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

  constructor(
    private route:ActivatedRoute, 
    private router:Router,
    private _userProfileService:UserProfileService,
    private _userService:UsersService,
    public _authService: AuthService,
    private raceService: RaceService,
  ) {}

  ngOnInit() {
    //Don't show edit page by default
    this.showEdit = false;

    this.route.paramMap.subscribe(params => {
      this.username = params['params']['username'];
      this.getUserData();
      console.log(this.username);
    });

    this.raceService.getRaces({}).subscribe(
      data => {
        this.racesData = data;
        this.userRaces = _.filter(this.racesData.races,(race:any) => {
          if(race.joined) {
            return race;
          }
        });
        console.log("USER RACES PROFILE", this.userRaces);
      }
    )

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:',changes);

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

  getUserData(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.getUserProfile(this.username).then((data) => {
      this.userData = data as UserData;
      console.log("New user data profPage: ", this.userData);

      if (this.userData.location == "") {
        this.userData.location = "N/A";
      }

      if (this.userData.description == "") {
        this.userData.description = "N/A";
      }
    });
  }

  logout() {
    this._authService.logout();
  }
  toggleEditView(): void{
    this.showEdit = !this.showEdit;
    console.log("EDIT .", this.showEdit);
  }

  viewRace(race:any) {
    console.log('SELECTED RACE:',race);

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
    this.toggleEditView();
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
