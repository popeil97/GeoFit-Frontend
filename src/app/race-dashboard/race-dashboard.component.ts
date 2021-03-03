import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { RaceService } from '../race.service';
import { RaceSettings } from '../race-about-page/race-about-page.component';
import { AuthService } from '../auth.service';

import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { Register2Component } from '../register2/register2.component';

@Component({
  selector: 'app-race-dashboard',
  templateUrl: './race-dashboard.component.html',
  styleUrls: ['./race-dashboard.component.css']
})
export class RaceDashboardComponent implements OnInit, OnChanges {

  public loading:Boolean = true;
  public raceID: number = null;
  public raceData: any = null;



  public isOwnerOrMod:Boolean = false;

  public page: string;

  public raceName: string;

  //Child race IDs (same as parent if no child IDs)
  public raceIDs:number[] = [];

  //Race ID of race info in current view
  public selectedRaceID: number;
  public selectedRaceName: string;

  //Info of all child races if present (else just parent race)
  public childRaceData: ChildRaceData[] = [];

  constructor(
    private route: ActivatedRoute,
    private raceService: RaceService,

    private _authService:AuthService,
    private router:Router,
    private dialog:MatDialog,
  ) { }

  ngOnInit() {

    // We add a subscription to the login event
    this._authService.getLoginStatus.subscribe(this.handleLoginChange);
    this.loading = true;
    this.raceData = null;

    this.route.paramMap.subscribe(params => {
      // Get the race ID from the URL
      this.raceID = params['params']['id'];
      if (this.raceID) {
        // there was a race ID in the URL
        if (this._authService.isLoggedIn()) {
          // We are logged in
          this.getRaceData();
        } else {
          // We aren't logged in
          this.loading = false;
        }
      } else {
        // There was no race ID in the url
        this.loading = false;
      }
    });
    /*
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
      this.page = (params['params']['page']) ? params['params']['page'] : 'admin';

      //this.loadingSegments.navigation = false;
      if (this._authService.isLoggedIn()) {
        // We ARE logged in, so we gotta pull race data
        this.getRaceData();
      } else {
        // We aren't logged in - this will auto-default to the login/signup screen in the html
        // once they log in though, we'll need to prompt them to reload the data
        this.loading = false;
      }
    });
    */
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

  handleLoginChange = (loggedIn:Boolean) => {
    if (loggedIn) {
      // we've logged in
      if (this.raceID) {
        // race ID was provided, gotta grab data
        this.loading = true;
        this.getRaceData();
      } else {
        // No Race ID was provided
        this.loading = false;
        this.raceData = null;
      }
    } else {
      // We've logged out
      this.loading = false;
      this.raceData = null;
    }
  }
  reloadData() {
    this.getRaceData();
  }
  private getRaceData(){
    this.loading = true;

    this.raceService.getRace(this.raceID).subscribe((data) => {

      let d = data as RaceData;
      
      // Catch if we're not a mod or owner
      if (!d.is_mod_or_owner) {
        this.loading = false;
        this.raceData = null;
        this.isOwnerOrMod = false;
        return;
      }
      console.log("Race data: ", d);

      this.raceData = d;
      this.isOwnerOrMod = this.raceData.is_mod_or_owner;

      // Child race data
      this.raceIDs = this.raceData.race_IDs;
      this.childRaceData = this.raceData.child_race_dict;
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