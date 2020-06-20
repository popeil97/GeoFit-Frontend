import { Component, OnInit } from '@angular/core';
import * as bootstrap from "bootstrap";
import { RaceService } from '../race.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Progress } from '../user-progress/user-progress.component';
import { ActivitiesService } from '../activities.service';
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
  private raceID:number;
  private modalData:any;
  public progress:Progress;
  public actsToImport:number[] = [];
  public loading:Boolean = false;
  public coords:any;
  public all_user_data:Array<FeedObj>;

  constructor(private raceService:RaceService,private activitiesService:ActivitiesService,private route: ActivatedRoute) { 
    this.modalData = {};
  }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });

    this.getRaceState();

    this.followers = [{
      first_name:'Nathan',
      last_name:'Cunt'
    },
    {
      first_name:'Katie',
      last_name:'DonaHOE'
    }];

    
  }

  showModal(id:string): void {
    ($(id) as any).modal('show');
  }

  hideModal(id:string): void {
    ($(id) as any).modal('hide');
  }

  importActs(): void {
    console.log(this.actsToImport);
    this.loading = true;
    this.activitiesService.importActivities(this.actsToImport,this.raceID).then((res) => {
      console.log(res);
      this.getRaceState();
      this.actsToImport = [];
    });
    this.loading = false;
  }

  addAct(act:any): void {
    console.log('IN ADD');
    let actID = act.id;
    let index = this.actsToImport.indexOf(actID);
    if(index >= 0) {
      this.actsToImport.splice(index,1);
    }
    else {
      this.actsToImport.push(actID);
    }

    console.log(this.actsToImport);
  }

  getRaceState(): void {
    this.raceService.getRace(this.raceID).subscribe(data => {
      
      let raceData = data as RaceData;
      console.log('RACE DATA:',raceData);
      this.progress = raceData.progress;
      this.activities = raceData.activities;
      this.coords = {coords:raceData.coords};
      this.all_user_data = raceData.users_data as Array<FeedObj>;

      console.log('COORDS:',this.coords);
      console.log(this.all_user_data);

      this.loading = false;
    });
  }

}

interface RaceData {
  progress:any;
  activities:any;
  coords:any;
  users_data:any;
}

interface FeedObj {
  user_id: number;
  display_name: string;
  profile_url:string
  joined: boolean;
  traveled: boolean;
  story: boolean;
  story_image:string;
  story_text:string;
  total_distance:number;
  last_distance:number;
  message: string;
  created_ts:number;
}
