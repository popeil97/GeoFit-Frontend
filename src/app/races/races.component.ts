import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { RaceService } from '../race.service';


@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {

  public races:any[];
  public userRaces:any[];
  public racesInvited:any[];
  public racesData:any;
  public isUserRaces:Boolean = true;
  public isInvitedRaces:Boolean;
  public isPublicRaces:Boolean;
  public joinedRacesIDs:number[];

  constructor(private raceService: RaceService, private router:Router) { }

  ngOnInit() {
    console.log('in races');

    this.raceService.getRaces({}).subscribe(
      data => {
        this.racesData = data;
        console.log('RACE DATA:',this.racesData);
        this.races = this.racesData.races;
        this.userRaces = this.racesData.user_races;
        this.racesInvited = this.racesData.races_invited;
        this.joinedRacesIDs = this.racesData.user_race_ids;
      }
    )

    // this.races = this.racesData.races;

    console.log('CONTR:',this.racesData);
  }

  viewRace(race:any) {
    console.log('SELECTED RACE:',race);

    // set race in race service

    this.raceService.setRace(race.id);

    this.router.navigate(['/race',{name:race.name}]);
  }

  joinRace(race:any) {
    let race_id = race.id;
    console.log('attemptiong to join race:',race);
    this.raceService.joinRace(race_id).subscribe(
      data=> {
        console.log('RECEIVED FROM JOIN:',data);
      }
    )
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

    console.log('isPublicRaces:',this.isPublicRaces);
    console.log('isInvitedRaces:',this.isInvitedRaces);
    console.log('isUserRaces:',this.isUserRaces);
  }

}
