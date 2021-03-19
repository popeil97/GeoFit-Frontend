import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewChecked, AfterViewInit } from '@angular/core';
import * as bootstrap from "bootstrap";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Progress } from '../user-progress/user-progress.component';
import { MapComponent } from '../map/map.component';
import { FeedComponent } from '../feed/feed.component';
import { StoryModalComponent } from '../story-modal/story-modal.component';
import { RaceSettings } from '../views/race-about/race-about.component';
import { TeamFormComponent } from '../team-form/team-form.component';

import { 
  AuthService,
  RaceService,
  UserProfileService,
  ActivitiesService,
  StoryService,
} from '../services';

import {
  UserData,
  Tag,
  TagType,
} from '../models'

import {
  RouteInfoComponent
} from '../popups';

import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import * as confetti from 'canvas-confetti';

import { LogActivityComponent } from '../log-activity/log-activity.component';

declare var $: any;
import * as _ from 'lodash';
import { RouteSelectComponent } from '../route-select/route-select.component';
import { HybridLeaderboardComponent } from '../hybrid-leaderboard/hybrid-leaderboard.component';
import { CheckpointDialogComponent } from '../checkpoint-list/checkpoint-dialog.component';


@Component({
  selector: 'app-race-view-page',
  templateUrl: './race-view-page.component.html',
  styleUrls: ['./race-view-page.component.css'],
})
export class RaceViewPageComponent implements OnInit,AfterViewInit {
  @ViewChild(MapComponent) mapChild: MapComponent;
  @ViewChild(FeedComponent) feedChild: FeedComponent;
  @ViewChild(StoryModalComponent) storyModal: StoryModalComponent;
  @ViewChildren(LeaderboardComponent) leaderboardChildren: QueryList<LeaderboardComponent>;
  @ViewChildren(HybridLeaderboardComponent) hybridLeaderboardChildren: QueryList<HybridLeaderboardComponent>;

  public followers:any[];
  public activities:any[];
  public num_activities:any;

  public raceName:string;

  //Parent race ID
  raceID:number;

  //Child race IDs (same as parent if no child IDs)
  public raceIDs:number[] = [];

  //Info of all child races if present (else just parent race)
  public childRaceData: ChildRaceData[] = [];
  public leaderboardRouteFilter: ChildRaceData = {id:null,name:"Null"};

  //Current race ID selected by user. If race has no children, this always equals
  //ID of parent race
  public selectedRaceID: number;
  public searchOn : boolean = false;
  private modalData:any;

  public progress:Progress = {} as Progress;
  public loading:Boolean = false;
  public teams:any[];
  public userRaceSettings:any;
  public raceType:number;
  public raceSettings:RaceSettings;
  public userData:UserData;
  public changeArrow:Boolean = false;
  public userStat:any = {};
  public followedIDs:number[];
  public isManualEntry:Boolean = false;
  public hasEntryTags:Boolean = false;
  public isHybrid: Boolean = false;
  public allowTeams: Boolean = false;

  public feedOptions:Boolean = false;

  //Team edit form
  public showTeamForm:Boolean = false;
  public teamEditForm:TeamEditBody = {
    isEdit:false,
    team_id:null
  };

  public race:any;

  //User access permissions
  public userRegistered:Boolean = false;
  public isOwnerOrModerator: Boolean = false;

  //Filters for activity feed
  public storyFeedOnly: Boolean = false;
  public followerFeedOnly: Boolean = false;

  private storyImage:string;
  private storyText:string;

  entryTagType: TagType = TagType.ENTRY;
  selectedTagFilterID = -1;

  isOpen = true;

  varcolors = ['#bb0000', '#ffffff'];

  public currentScreen = 'feed';
  public currentLeaderboard = 'individual';
  public acceptedScreens = ['feed','leaderboard','teams'];

  constructor(
    private raceService:RaceService,
    private activitiesService:ActivitiesService,
    private route: ActivatedRoute,
    private _userProfileService: UserProfileService,
    private router:Router,
    private storyService: StoryService,
    public _authService: AuthService,

    private dialog : MatDialog,
  ) {
    this.modalData = {};
  }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });

    if(this._authService.isLoggedIn()) {
      this._userProfileService.requestUserProfile(this._authService.username).then((data) => {
        this.userData = data as UserData;
      });
    }
    
    this.getRaceState();
    this.getActivities();

    const feedButton = document.getElementById('feed-btn');
    if (feedButton) {
      feedButton.style.backgroundColor = "#36343c";
      feedButton.style.color = "#FFFFFF";
    }
  }

  ngAfterViewInit(): void {
    this.setLeaderboardRouteFilter({id:this.raceID,name:'All'});
  }

  newStoryPosted(event: any) {
    console.log("new story");
    this.feedChild.refreshFeed();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleSearch() {
    this.searchOn = !this.searchOn;
  }

  openRouteInfo = () => {
    this.dialog.open(RouteInfoComponent,{
      panelClass:"DialogDefaultContainer"
    });
  }

  openLogActivity = () => {
    let tD = this.dialog.open(LogActivityComponent, {
      panelClass:"LogActivityContainer",
      data:{
        raceType:this.raceType, 
        distance_unit: this.progress.distance_type, 
        race_id:this.raceID, 
        numActivities : this.num_activities, 
        manualEntry:this.raceSettings.isManualEntry, 
        automaticImport: this.userRaceSettings.isAutomaticImport,
        uploadActivity: this.uploadActivity,
      }
    });
    tD.afterClosed().subscribe(result=>{
      // console.log('CLOSING LOG ACTIVITY', result);
      this.getRaceState();
      this.getActivities();
    })
  }

  uploadActivity = (incomingData = null) => {
    // const toAlert = (incomingData != null) ? incomingData : this.testString;
    if (incomingData == null || typeof incomingData === 'undefined') return;
    
    // console.log("PARENT INCOMING DATA",incomingData.type);
    switch(incomingData.type) {
      case('manual'):
        this.uploadManualEntry(incomingData.entry);
        break;
      case('strava'):
        this.refreshStatComponents();
        break;
      case('map'):
        console.log("MAP DATA INCOMING!")
        this.showPinsFromSettings(incomingData.pinSettings);
        break;
    }
  }

  logActivity(event:any) {
    console.log("RV", event);
  }

  public toggleOptions(){
    this.feedOptions = !this.feedOptions;
  }

  viewAbout() {
    this.router.navigate(['/about',{name:this.race.name,id:this.race.id}]);
  }

  setLeaderboardRouteFilter(route:ChildRaceData) {
    this.leaderboardRouteFilter = route;
    console.log('ROTUE CHANGED TO ', this.leaderboardRouteFilter);
  }

  setLeaderboardTagID(tagFilterStruct:any): void {
    this.selectedTagFilterID = tagFilterStruct.data.id;
  }

  toggleNavButton(action?:string) {
    this.changeArrow = !this.changeArrow;
  }

  toggleTeamForm(action?:string) {
    this.showTeamForm = !this.showTeamForm;
    if(action == 'clear') {
      this.teamEditForm.isEdit = false;
    }
  }
  
  showModal(id:string): void {
    ($(id) as any).modal('show');
  }

  showStoryModal(id:string): void {
    this.storyModal.showModal(id);
  }

  hideModal(id:string): void {
    ($(id) as any).modal('hide');
  }

  goToTeamForm(): void {
    this.router.navigate(['/teams',{name:this.raceName,id:this.raceID}]);
  }

  editTeamForm(team_id:number): void {
    this.teamEditForm = {
      team_id:team_id,
      isEdit:true
    } as TeamEditBody
    this.toggleTeamForm();
    // this.teamEditForm.isEdit = false;
  }

  setLoaderState(state:boolean): void {
    this.loading = state;
  }

  refreshAllComponents(): void {

    this.getRaceState();
    
    this.mapChild.getMapData();

    _.forEach(this.leaderboardChildren.toArray(),(child:LeaderboardComponent) => {
      child.getLeaderboard();
    });

    if(this.hybridLeaderboardChildren.length >= 1) {
      _.forEach(this.hybridLeaderboardChildren.toArray(),(child:HybridLeaderboardComponent) => {
        child.getLeaderboard();
      });
    }

  }

  refreshStatComponents(): void {
    // refresh any components stat related
    // leaderboards
    // user stats
    // personal race stat
    this.setLoaderState(true);
    this.getRaceState();
    
    //this.mapChild.getMapData();
    this.mapChild.updateMyUserStatAndCreatePins(this.selectedRaceID);

    _.forEach(this.leaderboardChildren.toArray(),(child:LeaderboardComponent) => {
      child.getLeaderboard();
    });

    if(this.hybridLeaderboardChildren.length >= 1) {
      _.forEach(this.hybridLeaderboardChildren.toArray(),(child:HybridLeaderboardComponent) => {
        child.getLeaderboard();
      });
    }
  }

  getRaceState(): void {
    this.loading = true;
    this.raceService.getRace(this.raceID).subscribe((data) => {
      console.log(data);
      this.showTeamForm=false;
      let raceData = data as RaceData;
      this.userRegistered = raceData.user_stat!=null;
      this.progress = raceData.progress;
      this.race = raceData.race;

      // if(this.progress.distance_remaining <= 0)
      // {
      //     confetti.create()({
      //     particleCount: 5000,
      //     spread: 900,
          
      //     origin: {
      //         y: (1),
      //         x: (0.5)
      //     }
      //   });
      // }

      this.num_activities = 0;

      // Child race data
      this.raceIDs = raceData.race_IDs;
      this.childRaceData = raceData.child_race_dict;
      this.childRaceData.unshift({id:this.raceID,name:'All'});
      
      // Race-specific info
      this.raceSettings = raceData.race_settings;
      this.raceType = raceData.race.race_type;
      this.hasEntryTags = this.raceSettings.has_entry_tags;
      this.isManualEntry = this.raceSettings.isManualEntry;
      this.isHybrid = this.race.is_hybrid;
      this.allowTeams = this.raceSettings.allowTeams;

      // User specific-info
      this.userRaceSettings = raceData.settings;
      this.userStat = raceData.user_stat;
      this.isOwnerOrModerator = raceData.is_mod_or_owner;

      this.loading = false;

      //Default to first race ID if not set
      if (this.selectedRaceID == undefined){
        this.selectedRaceID = this.raceIDs[0];
      }

    });
  }

  uploadManualEntry(entry) {
    this.activitiesService.uploadManualEntry(entry,this.selectedRaceID).then((resp) => {
      console.log('GOT MANUAL ENTRY:',resp);

      // handle checkpoints
      this.openCheckpointDialog(resp['checkpoints_passed']);

      this.refreshStatComponents();
    });
  }

  getActivities() {
    this.activitiesService.getActivities(this.raceID).then((data:any) => {
      this.activities = data.activities;
      this.num_activities = data.activities.length;
    });
  }


   panToUserMarker(user_id){
  //   //Call map pan function
  //   this.mapChild.panToUserMarker(user_id);
   }

  clearUserPins(){
    this.mapChild.clearUserPins();
  }

  // showPinsByID(IDs){
  //   //Pass null to show all pins
  //   this.mapChild.showPinsByID(IDs, false);
  // }

  showAllPins(){
    this.mapChild.showAllPins();
  }

  showPinsFromSettings(settings: PinSettings){
    this.mapChild.showPinsFromSettings(settings);
  }

  SwitchSlideshow = (to:string = null) => {
    //console.log("to", to, this.acceptedScreens.indexOf(to));
    if (to == null || this.acceptedScreens.indexOf(to) == -1) return;
    this.currentScreen = to;
    
    const toButton = document.getElementById(to+'-btn'),
        teamButton = document.getElementById('teams-btn');
    if (!toButton) { return; }
    
    toButton.style.backgroundColor = "#36343c";
    toButton.style.color = "#FFFFFF";

    switch(to) { 
      case 'feed':
        document.getElementById('leaderboard-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('leaderboard-btn').style.color = "#000000";
        if (teamButton) {
          document.getElementById('teams-btn').style.backgroundColor = "#FFFFFF";
          document.getElementById('teams-btn').style.color = "#000000";
        }
        break; 
      case 'leaderboard':
        document.getElementById('feed-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('feed-btn').style.color = "#000000";
        if (teamButton) {
          document.getElementById('teams-btn').style.backgroundColor = "#FFFFFF";
          document.getElementById('teams-btn').style.color = "#000000";
       }

        break; 
      case 'teams':
        document.getElementById('feed-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('feed-btn').style.color = "#000000";
        document.getElementById('leaderboard-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('leaderboard-btn').style.color = "#000000";
        break; 
    }
    return;
  }

  SwitchLeaderboard = (to:string = null) => {
    this.currentLeaderboard = to;
    document.getElementById(to+'-leaderboard-btn').style.backgroundColor = "#36343c";
    document.getElementById(to+'-leaderboard-btn').style.color = "#FFFFFF";

    switch(to) {
      case 'individual':
        document.getElementById('teams-leaderboard-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('teams-leaderboard-btn').style.color = "#000000";
        break;

      case 'teams':
        document.getElementById('individual-leaderboard-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('individual-leaderboard-btn').style.color = "#000000";
        break;

    }
    

  }

  openCheckpointDialog(checkpointIDs:number[]) {
    if(checkpointIDs == null) {
      return;
    }
    let dialogPayload = {
      data: {
        checkpointIDs: checkpointIDs
      }
    }
    let dialogRef = this.dialog.open(CheckpointDialogComponent,dialogPayload);
  }
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

export interface ChildRaceData {
  id: number,
  name: string,
}

interface FeedObj {
  user_id: number;
  display_name: string;
  username: string;
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

export interface TeamEditBody {
  team_id:number;
  isEdit:Boolean;
}

interface PinSettings {
  followerPinsOnly: boolean;
  malePinsOn: boolean;
  femalePinsOn: boolean;
  allAgesOn: boolean;
  minAge: number;
  maxAge: number;
  showOrgPins: boolean;
}


