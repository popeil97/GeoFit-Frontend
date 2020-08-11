import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { RaceService } from '../race.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';
import { AuthService } from '../auth.service';
import { UserProfileService } from '../userprofile.service';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class RacesComponent implements OnInit {
  userData: UserData;
  public races:any[];
  public userRaces:any[];
  public racesInvited:any[];
  public racesData:any;
  public isUserRaces:Boolean = true;
  public isInvitedRaces:Boolean;
  public isPublicRaces:Boolean;
  public joinedRacesIDs:number[];

  public loading:Boolean = false;

  dataSource = this.races;
  private columnsToDisplay:string[] = ['name','distance', 'start_loc', 'end_loc'];
  expandedElement: any | null;

  constructor(private raceService: RaceService, 
              private router:Router,
              public _authService: AuthService,private _userProfileService: UserProfileService) { }

  ngOnInit() {
    console.log('in races');

    this.races=[{
      name:'test'
    }] as any[];

    this.raceService.getRaces({}).subscribe(
      data => {
        this.racesData = data;
        console.log('RACE DATA:',this.racesData);
        this.races = _.filter(this.racesData.races,(race:any) => {
          if(!race.joined) {
            return race;
          }
        });
        console.log('RACES:',this.races)
        this.userRaces = _.filter(this.racesData.races,(race:any) => {
          if(race.joined) {
            return race;
          }
        });
        this.racesInvited = this.racesData.races_invited;
        this.joinedRacesIDs = this.racesData.user_race_ids;
      }
    )

    // this.races = this.racesData.races;

    console.log('CONTR:',this.racesData);

    if (localStorage.getItem('loggedInUsername')){
      this._authService.username = localStorage.getItem('loggedInUsername');

      this._userProfileService.getUserProfile(this._authService.username).then((data) => {
      this.userData = data as UserData;

       if (this.userData.location =="")
      {
        this.userData.location = "N/A";
      }

      if (this.userData.description =="")
      {
        this.userData.description = "N/A";
      }
    });
    }
  }

  viewRace(race:any) {
    console.log('SELECTED RACE:',race);

    // set race in race service

    this.router.navigate(['/race',{name:race.name,id:race.id}]);
  }

  joinRace(race:any) {
    this.loading = true;
    let race_id = race.id;
    console.log('attemptiong to join race:',race);
    this.raceService.joinRace(race_id).then((res) => {
      console.log('RES FROM JOIN:',res);
      this.loading = false;
      this.router.navigate(['/race',{name:race.name,id:race.id}]);
    });
  }

  viewAbout(race:any) {
    this.router.navigate(['/about',{name:race.name,id:race.id}]);
  }

  toggle_pill(pill_type:string) {
    if(pill_type == 'user') {
      this.isUserRaces = true;
      this.isPublicRaces = false;
      this.isInvitedRaces = false;
    }

    else if(pill_type == 'invited') {
      this.isUserRaces = false;
      this.isPublicRaces = false;
      this.isInvitedRaces = true;
    }

    else {
      this.isUserRaces = false;
      this.isPublicRaces = true;
      this.isInvitedRaces = false;
    }

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

