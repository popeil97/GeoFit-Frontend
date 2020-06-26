import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RaceFeedService } from './race-feed.service';

@Component({
  selector: 'app-race-feed',
  templateUrl: './race-feed.component.html',
  styleUrls: ['./race-feed.component.css']
})
export class RaceFeedComponent implements OnInit {
  @Input() raceID:number;
  @Output() feedItemClicked = new EventEmitter();

  private feedItems: Array<FeedObj>;

  constructor(private _raceFeedService : RaceFeedService) {
    this.feedItems = [];

  }

  ngOnInit() {
    this._raceFeedService.raceID = this.raceID;
    this.refreshFeed();
  }


  public refreshFeed(){
    var viewComponent = this;

    this._raceFeedService.refreshFeed().then(data => {
      console.log("FEED DATA: ", data);
      var newFeedObjs: Array<FeedObj> = [];

      Object.keys(data).map(function(feedItemIndex){
        let feedItem: FeedObj = data[feedItemIndex];
        newFeedObjs.push(feedItem);
      });

      viewComponent.feedItems = newFeedObjs.concat(viewComponent.feedItems);
    });

    console.log("Feed items: ", this.feedItems);

  }

  // public displayFeedItems(viewComponent, objs){
  //   var table = <HTMLTableElement>document.getElementById('users_all_view');

  //   var feedItemClicked = viewComponent.feedItemClicked;

  //   for (let i = 0; i < objs.length; i++){
  //     var row = table.insertRow(-1);
  //     var row_user_id = objs[i].user_id.toString();

  //     //Set ID of row so we can pan to user on click
  //     row.setAttribute("data-userid", row_user_id);
  //     row.addEventListener("click", function () {
  //         console.log("clicked!", row.getAttribute("data-userid"));
  //         feedItemClicked.emit(row.getAttribute("data-userid"));
  //         console.log("after click");
  //     })

  //     row.innerHTML = "<td style=\"table-layout: fixed;\"><img src=\"" + objs[i].profile_url + "\" width=\"50px\"></td> <td>" + objs[i].message;

  //     var userStoryImg = objs[i].story_image;
  //     var userStoryCaption = objs[i].story_text;
  //     console.log("USER STORY URL: ", userStoryImg);

  //     //Add story info to marker popup
  //     if (userStoryImg || userStoryCaption){
  //       row.innerHTML += "<div class=\"container\"><center>" +
  //                 "<a data-toggle=\"modal\" data-target=\"#storyModal\" data-userstatindex=\"" +
  //                 i +
  //                 "\">" +
  //                 "<br><img style=\"max-height:100px;\" src=\"" +
  //                 userStoryImg +
  //                 "\" style=\"max-width:150px;\"></a>" +
  //                 "</center>" +
  //                 "<center>" +
  //                 userStoryCaption +
  //                 "</center></div></td>";
  //     }
  //   }

  // }

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
}
