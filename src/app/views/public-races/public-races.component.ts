import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';

import { 
  AuthService,
  RaceService,
  UserProfileService,
} from '../../services';

import {
  UserData,
} from '../../interfaces';

import { 
  LoginComponent,
  RegisterComponent,
} from '../../popups';

import { ModalService } from '../../modalServices';



@Component({
  selector: 'app-public-races',
  templateUrl: './public-races.component.html',
  styleUrls: ['./public-races.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PublicRacesComponent implements OnInit {
    
  userData: UserData;
  public races:any[] = null;
  public userRaces:any[];
  public racesInvited:any[];
  public racesData:any;
  public isUserRaces:Boolean = true;
  public isInvitedRaces:Boolean;
  public isPublicRaces:Boolean;
  public joinedRacesIDs:number[];
  raceSettings:RaceSettings = {} as RaceSettings;

  public loading:Boolean = false;

  dataSource = this.races;
  private columnsToDisplay:string[] = ['name','distance', 'start_loc', 'end_loc'];
  expandedElement: any | null;

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
    private raceService: RaceService, 
    private router:Router,
    public dialog : MatDialog,

    public _authService: AuthService,
    private _userProfileService: UserProfileService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('loggedInUsername')){
      this._authService.username = localStorage.getItem('loggedInUsername');

      this._userProfileService.requestUserProfile(this._authService.username).then((data) => {
        this.userData = data as UserData;
        this.getPublicRaces(this.userData.user_id);

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
    else {
      this.getPublicRaces(null);
    }
  }

  openLogin = () => {
    const d = this.dialog.open(LoginComponent,{
      panelClass:"LoginContainer",
    });
    const sub = d.componentInstance.openRegister.subscribe(()=>{
      this.openRegister();
    })
    d.afterClosed().subscribe(result=>{
      console.log("Closing Login from Public Races");
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    })
  }

  openRegister = () => {
    const d = this.dialog.open(RegisterComponent, {
      panelClass: 'RegisterContainer'
    });
    const sub = d.componentInstance.openLogin.subscribe(() => {
      this.openLogin();
    });
    d.afterClosed().subscribe(result=>{
      console.log("Closing Register from Public Races");
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    });
  }

  navigateTo(url:string = null) {
    if (url != null) this.router.navigate([url]);
  }

  truncateHTML(text: string): string {

    let charlimit = 270;
    if(!text || text.length <= charlimit )
    {
        return text;
    }


  let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
  let shortened = without_html.substring(0, charlimit) + "...";
  return shortened;
}

  ProcessDate = (date = null) => {
    if (date == null) return {month:null,day:date}
    const dateComponents = date.split('-');
    return {month:this.monthKey[dateComponents[0]],day:dateComponents[1]}
  }

  getPublicRaces(user_id:number){
    // Get public races
    this.raceService.getRaces(user_id).subscribe(
      data => {
        this.racesData = data;

        this.races = _.filter(this.racesData.races,(race:any) => {
            race.raceSettings = this.getRaceSettings(race);
            race.start_date = this.ProcessDate(race.start_date);
            race.end_date = this.ProcessDate(race.end_date);
            return race;    
        });

        this.userRaces = _.filter(this.racesData.races,(race:any) => {
          return race.joined;
        });
        this.racesInvited = this.racesData.races_invited;
        this.joinedRacesIDs = this.racesData.user_race_ids;
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

 openModal(id: string,race:any) {
//     console.log("MODAL RACE", race);
    const data = (id == 'custom-modal-2') 
      ? {
        register:true, 
        price:race.raceSettings.price,
        race_id:race.id,
        hasTags: race.raceSettings.has_entry_tags
      } 
      : (id == 'custom-modal-3') 
        ? {
            price:race.raceSettings.price,
            race_id:race.id,
            hasTags: race.raceSettings.has_entry_tags
          } 
          : null;
   //  console.log("MODAL DATA", data);
    this.modalService.open(id,data);
  }
  closeModal(id: string) {
      this.modalService.close(id);
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