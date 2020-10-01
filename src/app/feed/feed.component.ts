import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { StoryModalComponent } from '../story-modal/story-modal.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { RaceFeedService } from './race-feed.service';
import { UserProfileService } from '../userprofile.service';
import { StoryFormComponent } from '../story-form/story-form.component';
import { AuthService } from '../auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { ReportFormComponent } from '../report-form/report-form.component';
import { StoryDeleteDialogComponent } from '../story-delete-dialog/story-delete-dialog.component';
import { ModalService } from '../modalServices';

declare var $: any

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  /*
  General Feed component that displays Race or User -specific events
  */

  @ViewChild(StoryModalComponent) storyModalChild: StoryModalComponent;

  @ViewChild(StoryFormComponent) storyFormComponent: StoryFormComponent;

  //ID of race or user
  @Input() ID:number;

  //Items on feed to display
  @Input() feedItems: Array<FeedObj>;

  //Progress object of logged in user
  @Input() progress: any;

  //Use of feed ('race' or 'user')
  @Input() use:string;

  //If true, we have our own story modal that is a child component of the feed component
  //If false, we emit when a story modal should be activated via storyItemClicked()
  @Input() hasStoryModalChild:boolean;

  //If true, only show feed items of people user follows
  @Input() followOnly:boolean;

  //If true, only show Stories (texts and images) in feed
  @Input() storyOnly:boolean;

  @Output() feedItemClicked = new EventEmitter();
  @Output() storyItemClicked = new EventEmitter();

  private _feedService: any;
  private initialized: boolean;
  private loading = false;

  //Variables for pagination
  private page_number = 1;
  private items_per_page = 10;
  private canRefresh: boolean = false;
  
  public dataSource: any;

  columns:string[] = ['ProfilePic','Data'];

  constructor(private _userProfileService: UserProfileService, 
              private _raceFeedService: RaceFeedService,
              public _authService: AuthService,
              public dialog: MatDialog,private modalService: ModalService,) {
  }

  ngOnInit() {
    if (this.use == 'race'){
      this._feedService = this._raceFeedService;
    }
    else if (this.use == 'user'){
      this._feedService = this._userProfileService;
    }

//    console.log("feed service: ", this._feedService);

    this._feedService.ID = this.ID;

    //If no feedItems provided as input, reset and refresh feed
    if (!this.feedItems){
      this.resetFeed();
      this.refreshFeed();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //Check if user or race ID changes between hops
    //If yes, we need to update our feed service and pull new data

    if (this.initialized){
      for(const propName in changes) {
        if(changes.hasOwnProperty(propName)) {

          switch(propName) {
            case 'ID':
              if(changes.ID.currentValue != undefined) {
                this._feedService.ID = this.ID;
                this.page_number = 1;

                this.resetFeed();
                this.refreshFeed();
              }
          }
        }
      }
    }

  }

  showStoryModal(storyID): void {
  //  console.log("open story modal!");

    //WE CAN EITHER EMIT STORY MODAL CLICK OUTPUT
    //OR CALL IT DIRECTLY TO THE CHILD MODAL
    if (!this.hasStoryModalChild){
      this.storyItemClicked.emit(storyID);
    }
    else{
      this.storyModalChild.showModal(storyID);
    }
  }

  showStoryDialog(element: FeedObj){
  //  console.log("In dialogue function");
    let dialogRef = this.dialog.open(StoryDialogComponent, {
      data: { 
        'element': element,
      },
    });
  }

  public refreshFeed(openStoryIDComments=null, getNextPage=false){
    var viewComponent = this;
    this.loading = true;

    if (getNextPage){
      this.page_number += 1;
    }
    console.log("getting feeditems");
    this._feedService.refreshFeed(this.page_number, this.items_per_page, !this.initialized).then(payload => {
      var newFeedObjs: Array<FeedObj> = [];
      var get_created_ts = this.get_created_ts;
      var data = payload.serialized_feed;
      this.canRefresh = payload.can_refresh;

      Object.keys(data).map(function(feedItemIndex){
        let feedItem: FeedObj = data[feedItemIndex];

        //By default don't open comment fields
        //Unless we have just posted a comment
        if (feedItem.story_id == openStoryIDComments){
          feedItem.show_comments = true;
        }
        else {
          feedItem.show_comments = false;
        }

        newFeedObjs.push(feedItem);
      });

      //viewComponent.feedItems = newFeedObjs.concat(viewComponent.feedItems);
      //Continue to explore ways to refresh feed. In meantime, get all feed objs every time
      viewComponent.feedItems = newFeedObjs;
      console.log("New feeditems: ", viewComponent.feedItems);
      this.loading = false;
    });

    this.initialized = true;
  }

  public get_created_ts(timestamp){
    var date = new Date();
    var ts = date.getTime() / 1000;
    var secondsPerMinute = 60;
    var secondsPerHour = secondsPerMinute * 60;
    var secondsPerDay = secondsPerHour * 24;
    var secondsPerWeek = secondsPerDay * 7;

    //Calculate how to display the timestamp of the activity
    //If ts is within an hour, show number of minutes since activity
    //If ts is over an hour, round to nearest hour
    var displayTime;
    if ((ts - timestamp) < secondsPerHour) {
      displayTime = Math.round((ts - timestamp) / secondsPerMinute) + "m";
    }
    else if ((ts - timestamp) < secondsPerDay) {
      displayTime = Math.round((ts - timestamp) / secondsPerHour) + "h";
    }
    else if ((ts - timestamp) < secondsPerWeek) {
      displayTime = Math.round((ts - timestamp) / secondsPerDay) + "d";
    }
    else {
      displayTime = Math.round((ts - timestamp) / secondsPerWeek) + "w";
    }
    return displayTime;
  }

  public resetFeed(){
 //   console.log(this._feedService);
    this._feedService.resetFeed();
  }

  clickedOnFeedItem(item){
    this.feedItemClicked.emit(item.user_id.toString());
  }

  newStoryPosted(){
    //Refresh feed on new story post
    this.refreshFeed();
  }

  newCommentPosted(storyID){
    //Feed items after comment posted
 //   console.log(this.feedItems);
    this.refreshFeed(storyID);
  }

  public openReportDialog(storyID: number){
    let dialogRef = this.dialog.open(ReportFormComponent, {
      data: { 
        'storyID': storyID,
      },
    });
  }

  public openDeleteStoryDialog(storyID: number){
    let dialogRef = this.dialog.open(StoryDeleteDialogComponent, {
      data: { 
        'storyID': storyID,
      },
    }).afterClosed().subscribe(response => {
      if (response && response['deleted']){
        this.resetFeed();
        this.refreshFeed();
      }
    });
  }

    openModal(id: string) {
    var data = (id == 'custom-modal-6') ? {raceID:this.ID, callbackFunction:null} : {};
     data.callbackFunction = this.testFunction;

    this.modalService.open(id,data);
  }

  testFunction = (incomingData = null) => {
  //  const toAlert = (incomingData != null) ? incomingData : this.testString;
  if(incomingData != null){
    this.newStoryPosted();
    console.log("PARENT",incomingData);
      }

  }

  
    

}


interface FeedObj {
  user_id: number;
  display_name: string;
  username: string;
  profile_url:string
  joined: boolean;
  traveled: boolean;
  likes: boolean;
  likes_count: number;
  story: boolean;
  story_image:string;
  story_text:string;
  story_id:number;
  total_distance:number;
  last_distance:number;
  message: string;
  created_ts:number;
  is_mine:boolean;
  comments: Comment[];
  show_comments: boolean;
  follows: boolean;
  hot: boolean;
}

interface FeedPayload {
  serialized_feed: FeedObj[];
  can_refresh: boolean;
}

interface Comment {
  username: string;
  display_name:string;
  profile_url:string;
  message:string;
  created_ts:number;
}
