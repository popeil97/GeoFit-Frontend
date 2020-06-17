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

  constructor(private raceService: RaceService, private router:Router) { }

  ngOnInit() {
    console.log('in races');

    this.raceService.getRaces({});

    //console.log(this.races);
  }

  viewRace(race:any) {
    console.log('SELECTED RACE:',race);

    // set race in race service

    this.raceService.setRace(race.id);

    this.router.navigate(['/race',{name:race.name}]);
  }

}
