import { Component, OnInit,OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { 
  AuthService,
  RaceService,
} from '../services';
import {
  UserData,
} from '../interfaces';
import * as _ from 'lodash';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-user-race',
  templateUrl: './user-race.component.html',
  styleUrls: ['./user-race.component.css']
})
export class UserRaceComponent implements OnInit,OnChanges,OnDestroy {

  @Input() userData: UserData;
  @Input() showCreateButton: any;

  private authUserDataSubscription:any = null;

  public races:any[] = null;
  public userRaces:any[] = null;
  public racesData:any;

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
    private raceService:RaceService,
    private authService:AuthService,
    private router:Router,
  ) {
    this.authUserDataSubscription = this.authService.userDataChange.subscribe(this.handleAuthUserDataChange);
  }

  ngOnInit() {
    if (this.userData != null) this.getRaces();
  }

  ngOnChanges(changes:SimpleChanges) {
    for (const propName in changes) {
      switch(propName) {
        case "userData":
          this.getRaces();
          break;
      }
    }
  }

  ngOnDestroy() {
    this.authUserDataSubscription.unsubscribe();
    this.races = null;
    this.userRaces = null;
  }

  handleAuthUserDataChange = (data:UserData) => {
    this.getRaces();
  }

  getRaces = () => {
    if (this.userData == null) return;
    const onlyPublic = (this.authService.userData != null) 
      ? (this.userData.user_id != this.authService.userData.user_id)
      : true;
    this.raceService.getRaces(this.userData.user_id,onlyPublic).subscribe(data => {
        this.racesData = data;
        this.races = _.filter(this.racesData.races,(race:any) => {
            race.start_date = this.ProcessDate(race.start_date);
            race.end_date = this.ProcessDate(race.end_date);
        //    console.log("RACE SET",race);
            return race;    
        });
         
       this.userRaces = _.filter(this.racesData.races,(race:any) => {
          //console.log(race,race.joined);
          if(race.joined) {
            return race;
          }
        });
        
      }
    )
  }

  ProcessDate = (date = null) => {
    if (date == null) return {month:null,day:date}
    const dateComponents = date.split('-');
    return {
      raw:date,
      month:this.monthKey[dateComponents[0]],
      day:dateComponents[1]
    }
  }

  viewRace(race:any) {
    this.router.navigate(['/race',{name:race.name,id:race.id}]);
  }

  viewAbout(race:any) {
    this.router.navigate(['/about',{name:race.name,id:race.id}]);
  }

  navigateTo(url:string = null) {
    if (url != null) this.router.navigate([url]);
  }

}