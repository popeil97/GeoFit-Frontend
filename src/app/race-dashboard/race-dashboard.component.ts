import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { RaceService } from '../race.service';
import { RaceSettings } from '../race-about-page/race-about-page.component';

@Component({
  selector: 'app-race-dashboard',
  templateUrl: './race-dashboard.component.html',
  styleUrls: ['./race-dashboard.component.css']
})
export class RaceDashboardComponent implements OnInit, OnChanges {
  public raceName: string;
  public raceID: number;

  //Child race IDs (same as parent if no child IDs)
  public raceIDs:number[] = [];

  //Race ID of race info in current view
  public selectedRaceID: number;
  public selectedRaceName: string;

  //Info of all child races if present (else just parent race)
  public childRaceData: ChildRaceData[] = [];

  public loading:Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private raceService: RaceService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
      this.getRaceData();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        switch(propName) {
          case 'raceID':
            console.log("Getting race data");
            if (this.raceID){
              this.getRaceData();
            }
        }
      }
    }
  }

  private getRaceData(){
    this.loading = true;

    this.raceService.getRace(this.raceID).subscribe((data) => {
      let raceData = data as RaceData;

      console.log("Race data: ", raceData);

      // Child race data
      this.raceIDs = raceData.race_IDs;
      this.childRaceData = raceData.child_race_dict;
      this.childRaceData.unshift({id:this.raceID,name:'All'});
      
      // Race-specific info
      /*
      CAN USE THIS INFO WHEN IT IS NECESSARY IN DASHBOARD
      */
      // this.race = raceData.race;
      // this.raceSettings = raceData.race_settings;
      // this.raceType = raceData.race.race_type;
      // this.hasEntryTags = this.raceSettings.has_entry_tags;
      // this.isManualEntry = this.raceSettings.isManualEntry;
      // this.isHybrid = this.race.is_hybrid;

      this.loading = false;

      //Default to first race ID if not set
      if (this.selectedRaceID == undefined){
        this.selectedRaceID = this.raceIDs[0];
      }

    });
    
  }

}

export interface ChildRaceData {
  id: number,
  name: string,
}

interface RaceData {
  progress:any;
  race:any;
  activities:any;
  settings:any;
  race_settings:RaceSettings;
  user_stat:any;
  followedIDs:number[];
  is_mod_or_owner:boolean;
  IDs_to_name: any;
  race_IDs: number[];
  child_race_dict: ChildRaceData[];
}