import { Component, OnInit } from '@angular/core';
import { RaceFeedService } from './race-feed.service';

interface FeedObj {
  user_id: number;
  display_name: string;
  joined: boolean;
  traveled: boolean;
  story: boolean;
  distance: number;
  message: string;
}

@Component({
  selector: 'app-race-feed',
  templateUrl: './race-feed.component.html',
  styleUrls: ['./race-feed.component.css']
})
export class RaceFeedComponent implements OnInit {

  public feedItems: Array<FeedObj>;

  constructor(private _raceFeedService : RaceFeedService) { 
    this.feedItems = [];
  }

  ngOnInit() {
  }

  public refreshFeed(refresh=false){
    this._raceFeedService.refreshFeed(refresh).then(data => {
      var newFeedObjs: Array<FeedObj> = [];
      var calcMessage = this.calculateMessage;

      Object.keys(data).map(function(feedItemIndex){
        let feedItem: FeedObj = data[feedItemIndex];
        feedItem.message = calcMessage(feedItem);
        console.log(feedItem);
        newFeedObjs.push(feedItem);
      });

      this.feedItems = newFeedObjs.concat(this.feedItems);
    });
 
  }

  public calculateMessage(item){
    console.log(item);
    let messageStrings: string[] = [];

    if (item.joined){
      messageStrings.push("joined the race");
    }
    if (item.traveled){
      //Will need vars to store verb (ran/cycled) and units (miles/km)
      messageStrings.push("traveled " + item.distance + " miles");
    }
    if (item.story){
      messageStrings.push("uploaded a new story!");
    }

    return item.display_name.toString() + " " + messageStrings.join(' and ');
  }

}
