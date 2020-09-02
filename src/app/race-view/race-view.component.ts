import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
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
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import * as confetti from 'canvas-confetti';

declare var $: any;
import * as _ from 'lodash';
import { TagType, Tag } from '../tags.service';


@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.css'],
})
export class RaceViewComponent implements OnInit {
  @ViewChild(MapComponent) mapChild: MapComponent;
  @ViewChild(FeedComponent) feedChild: FeedComponent;
  @ViewChild(StoryModalComponent) storyModal: StoryModalComponent;
  @ViewChildren(LeaderboardComponent) leaderboardChildren: QueryList<LeaderboardComponent>;

  public followers:any[];
  public activities:any[];
  public num_activities:any;
  private raceName:string;
  raceID:number;
  private modalData:any;

  public progress:Progress = {} as Progress;
  
  public loading:Boolean = false;
  //public coords:any;
  //public all_user_data:Array<FeedObj>;
  public teams:any[];
  public userRaceSettings:any;
  public raceSettings:RaceSettings;
  //public routePins:any[];
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

  entryTagType: TagType = TagType.ENTRY;
  selectedTagFilterID = -1;

  varcolors = ['#bb0000', '#ffffff'];

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
      console.log("DATAAAAAAAAAAAAAAAAA",this.userData);
    });

    this.getRaceState();

    // go GATORS!

  

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

  }

  refreshStatComponents(): void {
    // refresh any components stat related
    // leaderboards
    // user stats
    // personal race stat
    this.getRaceState();
    
    //this.mapChild.getMapData();
    this.mapChild.updateMyUserStatAndCreatePins();

    _.forEach(this.leaderboardChildren.toArray(),(child:LeaderboardComponent) => {
      child.getLeaderboard();
    });
  }

  getRaceState(): void {
    this.loading = true;
    this.raceService.getRace(this.raceID).subscribe(data => {
      this.showTeamForm=false;
      let raceData = data as RaceData;
      console.log('RACE DATA:',raceData);

      this.progress = raceData.progress;

      if(this.progress.distance_remaining <= 0)
      {
            confetti.create()({
            particleCount: 5000,
            spread: 900,
            
            origin: {
                y: (1),
                x: (0.5)
            }
        });
      }
      console.log("GETTING RACE STATE");
      // this.activities = raceData.activities;
      this.num_activities = 0;

      //this.coords = raceData.coords;
      
      //this.all_user_data = raceData.users_data as Array<FeedObj>;
      this.followedIDs = raceData.followedIDs;

      // this.teams = raceData.users_data.filter((user_data) => {
      //   if(user_data.isTeam) {
      //     return user_data;
      //   }
      // });

      this.userRaceSettings = raceData.settings;
      this.raceSettings = raceData.race_settings;
      console.log('RACE SETTINGS:',this.raceSettings);
      this.isManualEntry = this.raceSettings.isManualEntry;
      this.userStat = raceData.user_stat;
      //this.routePins = raceData.route_pins;
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
      this.refreshStatComponents();
    });
  }
  panToUserMarker(user_id){
    //Call map pan function
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
  }

  createUserHeatPins(){
    //Pass null to show all pins
    this.mapChild.createUserPins(true);
  }

  showAllPins(){
    this.mapChild.showAllPins();
  }

  showPinsFromSettings(settings: PinSettings){
    this.mapChild.showPinsFromSettings(settings);
  }

}

interface RaceData {
  progress:any;
  activities:any;
  //coords:any;
  //users_data:any;
  settings:any;
  race_settings:RaceSettings;
  user_stat:any;
  followedIDs:number[];
  //route_pins:any[];
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
