import { Component, OnInit, ViewChild } from '@angular/core';
import * as bootstrap from "bootstrap";
import { RaceService } from '../race.service';
import { StoryService } from '../story.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Progress } from '../user-progress/user-progress.component';
import { ActivitiesService } from '../activities.service';
import { MapComponent } from '../map/map.component';
import { FeedComponent } from '../feed/feed.component';
import { StoryModalComponent } from '../story-modal/story-modal.component';
import { RaceSettings } from '../race-about/race-about.component';
import { TeamFormComponent } from '../team-form/team-form.component';
import { AuthService } from '../auth.service';
import { UserProfileService } from '../userprofile.service';

declare var $: any

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.css'],
})
export class RaceViewComponent implements OnInit {
  @ViewChild(MapComponent) mapChild: MapComponent;
  @ViewChild(FeedComponent) feedChild: FeedComponent;
  @ViewChild(StoryModalComponent) storyModal: StoryModalComponent;

  public followers:any[];
  public activities:any[];
  public num_activities:any;
  private raceName:string;
  raceID:number;
  private modalData:any;

  public progress:Progress = {} as Progress;
  public actsToImport:number[] = [];
  public loading:Boolean = false;
  public coords:any;
  public all_user_data:Array<FeedObj>;
  public teams:any[];
  public userRaceSettings:any;
  public raceSettings:RaceSettings;
  public routePins:any[];
  public userData:UserData;

  public showTeamForm:Boolean = false;
  public changeArrow:Boolean = false;
  public userStat:any = {};
  public followedIDs:number[];
  public teamEditForm:TeamEditBody = {
    isEdit:false,
    team_id:null
  };
  public isManualEntry:Boolean = false;

  //Filters for activity feed
  public storyFeedOnly: Boolean = false;
  public followerFeedOnly: Boolean = false;

  private storyImage:string;
  private storyText:string;

  constructor(private raceService:RaceService,
                  private activitiesService:ActivitiesService,
                  private route: ActivatedRoute,
                  private _userProfileService: UserProfileService,
                  private router:Router,
                  private storyService: StoryService,
                  public _authService: AuthService) {
    this.modalData = {};
  }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });

    this._userProfileService.getUserProfile(this._authService.username).then((data) => {
      this.userData = data as UserData;
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

  toggleNavButton(action?:string) {
    this.changeArrow = !this.changeArrow;
   
  }

  toggleTeamForm(action?:string) {
    this.showTeamForm = !this.showTeamForm;
    console.log('ACTION IS:',action);
    if(action == 'clear') {
      this.teamEditForm.isEdit = false;
    }
    
  }
  
  showModal(id:string): void {
    console.log(id);
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
    console.log('TEAM BODY FORM:',this.teamEditForm);
    this.toggleTeamForm();
    // this.teamEditForm.isEdit = false;
  }

  importActs(): void {
    console.log('GONNA IMPORT THIS SHIT:',this.actsToImport);
    this.loading = true;
    this.activitiesService.importActivities(this.actsToImport,this.raceID).then((res) => {
      console.log(res);
      this.actsToImport = [];
      console.log('BEFORE GETRACESTATE:',this.actsToImport);
      this.getRaceState();
      console.log('AFTER GETRACESTATE:',this.actsToImport);
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
    this.loading = true;
    this.raceService.getRace(this.raceID).subscribe(data => {
      this.showTeamForm=false;
      let raceData = data as RaceData;
      console.log('RACE DATA:',raceData);

      this.progress = raceData.progress;
      this.activities = raceData.activities;
      this.num_activities = this.activities.length;

      this.coords = raceData.coords;
      
      this.all_user_data = raceData.users_data as Array<FeedObj>;
      this.followedIDs = raceData.followedIDs;

      this.teams = raceData.users_data.filter((user_data) => {
        if(user_data.isTeam) {
          return user_data;
        }
      });

      this.userRaceSettings = raceData.settings;
      this.raceSettings = raceData.race_settings;
      this.isManualEntry = this.raceSettings.isManualEntry;
      this.userStat = raceData.user_stat;
      this.routePins = raceData.route_pins;

      console.log('TEAMS:',this.teams);
      console.log('COORDS:',this.coords);
      console.log("ALL USER DATA", this.all_user_data);
      console.log('USER SETTINGS:',this.userRaceSettings);
      console.log("FOLLOWER IDS", this.followedIDs);
      console.log("ROUTE PINS ", this.routePins);
      console.log("USER_STAT", this.userStat);
      this.loading = false;
    });
  }

  USA(action?:string) {
  console.log("USA");
  this.mapChild.panToUSA();
  }

  Israel(action?:string) {
  this.mapChild.panToIsrael();
  }
  uploadManualEntry(entry:any) {
    this.activitiesService.uploadManualEntry(entry,this.raceID).then((resp) => {
      console.log('RESP FROM MANUAL IMPORT:',resp);
      this.getRaceState();
    });
  }
  panToUserMarker(user_id){
    //Call map pan function
    console.log("Clicked user id: ", user_id);
    this.mapChild.panToUserMarker(user_id);
  }

  clearUserPins(){
    this.mapChild.clearUserPins();
  }

  showPinsByID(IDs){
    //Pass null to show all pins
    this.mapChild.showPinsByID(IDs, false);
  }

  createUserPins(){
    //Pass null to show all pins
    this.mapChild.createUserPins(false);
    console.log("creating new user pins...")
  }

  createUserHeatPins(){
    //Pass null to show all pins
    this.mapChild.createUserPins(true);
    console.log("Applying heat map...")
  }

  showAllPins(){
    this.mapChild.showAllPins();
    console.log("Showing all pins");
  }

  showPinsFromSettings(settings: PinSettings){
    this.mapChild.showPinsFromSettings(settings);
  }

}

interface RaceData {
  progress:any;
  activities:any;
  coords:any;
  users_data:any;
  settings:any;
  race_settings:RaceSettings;
  user_stat:any;
  followedIDs:number[];
  route_pins:any[];
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
}


interface UserData {
  user_id:number;
  profile_url:string;
  email:string;
  description: string;
  location:string;
  first_name:string;
  last_name:string;
  follows:boolean;
  distance_type: string;
  is_me: boolean;
}
