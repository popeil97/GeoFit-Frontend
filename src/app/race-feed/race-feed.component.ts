import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RaceFeedService } from './race-feed.service';

@Component({
  selector: 'app-race-feed',
  templateUrl: './race-feed.component.html',
  styleUrls: ['./race-feed.component.css']
})
export class RaceFeedComponent implements OnInit {
  @Input() feedItems: Array<FeedObj>;
  @Output() feedItemClicked = new EventEmitter;

  constructor(private _raceFeedService : RaceFeedService) { 
    this.feedItems = [];
  }

  ngOnInit() {
  }

  public refreshFeed(){
    //Change false to true when using 'refresh' functionality
    this._raceFeedService.refreshFeed(false).then(data => {
      var newFeedObjs: Array<FeedObj> = [];

      Object.keys(data).map(function(feedItemIndex){
        let feedItem: FeedObj = data[feedItemIndex];
        newFeedObjs.push(feedItem);
      });

      this.feedItems = newFeedObjs.concat(this.feedItems);
    });
 
  }

  public displayFeedItems(){
    var table = <HTMLTableElement>document.getElementById('users_all_view');
    var feedItemClicked = this.feedItemClicked;

    for (let i = 0; i < this.feedItems.length; i++){
      var row = table.insertRow(-1);
      var row_user_id = this.feedItems[i].user_id.toString();

      //Set ID of row so we can pan to user on click
      row.setAttribute("data-userid", row_user_id);
      row.addEventListener("click", function () {
          feedItemClicked.emit(this.getAttribute("data-userid"));
      })

    }

  }

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
