import { Component, OnInit } from '@angular/core';
import * as bootstrap from "bootstrap";
import { RaceService } from '../race.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare var $: any

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.css']
})
export class RaceViewComponent implements OnInit {

  public followers:any[];
  public activities:any[];
  private raceName:string;
  private modalData:any;

  constructor(private raceService:RaceService,private route: ActivatedRoute) { 
    this.modalData = {};
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
    });

    this.followers = [{
      first_name:'Nathan',
      last_name:'Cunt'
    },
    {
      first_name:'Katie',
      last_name:'DonaHOE'
    }];

    this.activities = [
      {
        name:'Act 1',
        distance_type:'Mi',
        converted_dist:23,
        start_date:'06/11/2020'
      },
      {
        name:'Act 2',
        distance_type:'Mi',
        converted_dist:27,
        start_date:'06/12/2020'
      }
    ]
  }

  showModal(id:string): void {
    ($(id) as any).modal('show');
  }

  hideModal(id:string): void {
    ($(id) as any).modal('hide');
  }

}
