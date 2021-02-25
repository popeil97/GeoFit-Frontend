import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../auth.service';

import { MatDialog } from '@angular/material';
import { LoginComponent } from '../../login/login.component';
import { Register2Component } from '../../register2/register2.component';

import { RaceService } from '../../race.service';
import { UserProfileService } from '../../userprofile.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-public-races',
  templateUrl: './public-races.component.html',
  styleUrls: ['./public-races.component.css']
})
export class PublicRacesComponent implements OnInit {

  public racesData:any;
  public races:any[] = null;
  raceSettings:RaceSettings = {} as RaceSettings;

  userData: UserData;
  public userRaces:any[];
  public racesInvited:any[];
  public joinedRacesIDs:number[];

  public loading:Boolean = false;

  private monthKey = {
    '1':'Jan.',
    '2':'Feb.',
    '3':'Mar.',
    '4':'Apr.',
    '5':'May',
    '6':'June',
    '7':'July',
    '8':'Aug.',
    '9':'Sep.',
    '10':'Oct.',
    '11':'Nov.',
    '12':'Dec.',
  }

  constructor(
    public _authService: AuthService,
    public router : Router,
    public dialog : MatDialog,

    private raceService: RaceService, 
    private _userProfileService: UserProfileService,
  ) { }

  ngOnInit() {
    //If we already store a JWT locally, set it in memory
    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
      this._authService.username = localStorage.getItem('loggedInUsername');
      this._userProfileService.getUserProfile(this._authService.username).then((data) => {
        this.userData = data as UserData;
        this.getPublicRaces(this.userData.user_id);
        if (this.userData.location =="") {
          this.userData.location = "N/A";
        }

        if (this.userData.description =="") {
          this.userData.description = "N/A";
        }
      });

    }
    this.getPublicRaces(null);
  }

  logout() {
    this._authService.logout();
  }

  openLogin = () => {
    let d = this.dialog.open(LoginComponent,{
      panelClass:"LoginContainer",
      data:{register:false}
    });
    d.afterClosed().subscribe(result=>{
      console.log("CLOSE LOGIN FROM to_race_creators", result);
    })
  }

  openRegister = () => {
    let d = this.dialog.open(Register2Component, {
      panelClass:"RegisterContainer",
      data:{register:false},
    });
    d.afterClosed().subscribe(result=>{
      console.log("CLOSE REGISTER FROM to_race_creators", result);
    })
  }

  navigateTo(url:string = null) {
    if (url != null) this.router.navigate([url]);
  }
  scrollToElement = (id : string) => {
    const el = document.getElementById(id);
    if (el) {
      var headerOffset = 64;
      var elementPosition = el.offsetTop;
      var offsetPosition = elementPosition - headerOffset;
      document.documentElement.scrollTop = offsetPosition;
      document.body.scrollTop = offsetPosition; // For Safari
      //el.scrollIntoView();
    }
  }

  getPublicRaces(user_id:number){
    // Get public races
    this.raceService.getRaces(user_id).subscribe(
      data => {
        this.racesData = data;

        this.races = _.filter(this.racesData.races,(race:any) => {
            race.raceSettings = this.getRaceSettings(race);
            race.start_date = this.processDate(race.start_date);
            race.end_date = this.processDate(race.end_date);
            return race;    
        });

        this.userRaces = _.filter(this.racesData.races,(race:any) => {
          return race.joined;
        });
        this.racesInvited = this.racesData.races_invited;
        this.joinedRacesIDs = this.racesData.user_race_ids;

        console.log("RACES:",this.races,"USER RACES:", this.userRaces);
      }
    )
  }

  getRaceSettings(race:any)
  {
    this.raceService.getRaceAbout(race.id).then((resp) => {
      resp = resp as any;
      this.raceSettings = resp['race_settings'];
      race.raceSettings = this.raceSettings;
    //   console.log("RACE SETTINGS", this.raceSettings);
      return this.raceSettings;
    });
  }

  processDate = (date = null) => {
    if (date == null) return {month:null,day:date}
    const dateComponents = date.split('-');
    return {month:this.monthKey[dateComponents[0]],day:dateComponents[1]}
  }

  sanitizeHTML(text: string): string {
    let charlimit = 270;
    if (!text || text.length == 0) return text;

    let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
    let shortened = (without_html.length > charlimit) 
      ? without_html.substring(0, charlimit) + "..."
      : without_html;
    return shortened;
  }

  trySignup(): void {
    if(!this._authService.isLoggedIn()) {
     // this.router.navigate(['/register',{params:JSON.stringify({redirectParams: {name:this.raceName,id:this.raceID,popup:true}, redirectUrl:'/about'})}]);
    }
  }
  
  viewRace(race:any) {
//     console.log('SELECTED RACE:',race);

    // set race in race service

    this.router.navigate(['/race',{name:race.name,id:race.id}]);
  }

  joinRace(race:any) {
    this.loading = true;
    let race_id = race.id;
 //    console.log('attemptiong to join race:',race);
    this.raceService.joinRace(race_id).then((res) => {
   //    console.log('RES FROM JOIN:',res);
      this.loading = false;
      this.router.navigate(['/race',{name:race.name,id:race.id}]);
    });
  }

  viewAbout(race:any) {
    this.router.navigate(['/about',{name:race.name,id:race.id}]);
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
}

export interface RaceSettings {
  isManualEntry:Boolean;
  allowTeams:Boolean;
  race_id:number;
  max_team_size:number;
  paymentRequired: Boolean,
  price:any,
  has_swag:Boolean,
  has_entry_tags:Boolean,
}