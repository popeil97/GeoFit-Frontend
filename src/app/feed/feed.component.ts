import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { StoryModalComponent } from '../story-modal/story-modal.component';
import { RaceFeedService } from './race-feed.service';
import { UserProfileService } from '../userprofile.service';
import { StoryFormComponent } from '../story-form/story-form.component';

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

  @Output() feedItemClicked = new EventEmitter();
  @Output() storyItemClicked = new EventEmitter();

  private _feedService: any;

  private initialized: boolean;

  private columns:string[] = ['ProfilePic','Data'];

  constructor(private _userProfileService: UserProfileService, private _raceFeedService: RaceFeedService) {
  }

  ngOnInit() {
    if (this.use == 'race'){
      this._feedService = this._raceFeedService;
    }
    else if (this.use == 'user'){
      this._feedService = this._userProfileService;
    }

    console.log("feed service: ", this._feedService);

    this._feedService.ID = this.ID;

    //If no feedItems provided as input, reset and refresh feed
    if (!this.feedItems){
      this.resetFeed();
      this.refreshFeed();
    }

    //this.storyFormComponent.setStoryImageFieldListener();
    this.initialized = true;
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
                this.resetFeed();
                this.refreshFeed();
              }
          }
        }
      }
    }

  }

  showStoryModal(storyID): void {
    console.log("open story modal!");

    //WE CAN EITHER EMIT STORY MODAL CLICK OUTPUT
    //OR CALL IT DIRECTLY TO THE CHILD MODAL
    if (!this.hasStoryModalChild){
      this.storyItemClicked.emit(storyID);
    }
    else{
      this.storyModalChild.showModal(storyID);
    }
  }

  public refreshFeed(){
    var viewComponent = this;

    this._feedService.refreshFeed().then(data => {
      console.log("FEED DATA: ", data);
      var newFeedObjs: Array<FeedObj> = [];

      Object.keys(data).map(function(feedItemIndex){
        let feedItem: FeedObj = data[feedItemIndex];
        newFeedObjs.push(feedItem);
      });

      //viewComponent.feedItems = newFeedObjs.concat(viewComponent.feedItems);
      //Continue to explore ways to refresh feed. In meantime, get all feed objs every time
      viewComponent.feedItems = newFeedObjs;
    });
  }

  public resetFeed(){
    console.log(this._feedService);
    this._feedService.resetFeed();
  }

  clickedOnFeedItem(item){
    this.feedItemClicked.emit(item.user_id.toString());
  }
}


interface FeedObj {
  user_id: number;
  display_name: string;
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
}

interface Comment {
  display_name:string;
  profile_url:string;
  message:string;
  created_ts:number;
}
