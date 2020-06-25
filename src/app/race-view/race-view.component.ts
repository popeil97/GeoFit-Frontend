import { Component, OnInit, ViewChild } from '@angular/core';
import * as bootstrap from "bootstrap";
import { RaceService } from '../race.service';
import { StoryService } from '../story.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Progress } from '../user-progress/user-progress.component';
import { ActivitiesService } from '../activities.service';
import { LeaderboardItem } from '../leaderboard/leaderboard.component';
import { MapComponent } from '../map/map.component';
import { RaceFeedComponent } from '../race-feed/race-feed.component';
declare var $: any

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.css']
})
export class RaceViewComponent implements OnInit {
  @ViewChild(MapComponent) mapChild: MapComponent ;
  @ViewChild(RaceFeedComponent) feedChild: RaceFeedComponent;

  public followers:any[];
  public activities:any[];
  private raceName:string;
  private raceID:number;
  private modalData:any;
  public progress:Progress = {} as Progress;
  public actsToImport:number[] = [];
  public loading:Boolean = false;
  public coords:any;
  public leaderboard:LeaderboardItem[];
  public all_user_data:Array<FeedObj>;

  private storyImage:string;
  private storyText:string;

  constructor(private raceService:RaceService,
                  private activitiesService:ActivitiesService,
                  private route: ActivatedRoute,
                  private storyService: StoryService) {
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

    //Add listener to story image upload field
    this.setStoryImageFieldListener();
  }

  showModal(id:string): void {
    console.log(id);
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
      this.leaderboard = raceData.leaderboard;
      this.all_user_data = raceData.users_data as Array<FeedObj>;

      console.log('COORDS:',this.coords);
      console.log("ALL USER DATA", this.all_user_data);
      console.log("LEADERBOARD ITEMS: ", this.leaderboard);

      this.loading = false;
    });
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

  setStoryImageFieldListener(){
    //LISTENS TO CHANGES IN IMAGE FILE UPLOAD
    var setStoryImg = this.setStoryImage;
    var viewComponent = this;

    var storyImageField = <HTMLInputElement>document.getElementById("storyImage");
    console.log("adding story event listener");
    storyImageField.addEventListener('change', function() {
      var file = this.files[0];
      var reader: FileReader = new FileReader();
      reader.onload = function(e) {
          setStoryImg(viewComponent, reader.result);
      }
      reader.readAsDataURL(file);
    }, false);

  }

  setStoryImage(viewComponent, img_data): void{
    viewComponent.storyImage = img_data;
  }

  uploadStory(): void{
    //This bool tells Django whether to add these fields to the user's last story
    //or simply create a new story that has no activities
    //False by default but implement mechanism for true in future
    let withLastStory = false;

    //Get text field input (image already uploaded via eventListener)
    this.storyText = (<HTMLInputElement>document.getElementById("storyImageCaption")).value;

    //Upload story via service
    this.storyService.uploadStory(this.raceID, this.storyImage, this.storyText, withLastStory);
  }

}

interface RaceData {
  progress:any;
  activities:any;
  coords:any;
  leaderboard:any;
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
