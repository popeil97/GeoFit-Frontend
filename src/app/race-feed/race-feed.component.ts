import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RaceFeedService } from './race-feed.service';

@Component({
  selector: 'app-race-feed',
  templateUrl: './race-feed.component.html',
  styleUrls: ['./race-feed.component.css']
})
export class RaceFeedComponent implements OnInit {
  @Input() feedItems: Array<FeedObj>;
  @Output() feedItemClicked = new EventEmitter();

  constructor(private _raceFeedService : RaceFeedService) { 
  }

  ngOnInit() {
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   for(const propName in changes) {
  //     if(changes.hasOwnProperty(propName)) {
  //       switch(propName) {
  //         case 'feedItems':
  //           if(changes.feedItems.currentValue != undefined) { 
  //             this.refreshFeed();
  //           }
  //       }
  //     }
  //   }
    
  // }

  public refreshFeed(){
    this._raceFeedService.refreshFeed(false).then(data => {
      console.log("FEED DATA: ", data);
      var newFeedObjs: Array<FeedObj> = [];

      Object.keys(data).map(function(feedItemIndex){
        let feedItem: FeedObj = data[feedItemIndex];
        newFeedObjs.push(feedItem);
      });

      this.feedItems = newFeedObjs.concat(this.feedItems);
    });

    console.log("Feed items: ", this.feedItems);
 
    //Create table rows
    this.displayFeedItems();
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
          console.log("clicked!", row.getAttribute("data-userid"));
          feedItemClicked.emit(row.getAttribute("data-userid"));
          console.log("after click");
      })

      row.innerHTML = row.innerHTML = "<td style=\"table-layout: fixed;\"><img src=\"" + this.feedItems[i].profile_url + "\" width=\"50px\"></td> <td>" + this.feedItems[i].message + "</td>";

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
