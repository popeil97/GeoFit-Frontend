import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-race-dashboard',
  templateUrl: './race-dashboard.component.html',
  styleUrls: ['./race-dashboard.component.css']
})
export class RaceDashboardComponent implements OnInit {
  public raceName: string;
  public raceID: number;

  public loading:Boolean = false;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });
  }

}
