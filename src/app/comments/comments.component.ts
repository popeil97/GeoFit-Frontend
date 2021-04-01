import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { 
  AuthService,
  StoryService,
} from '../services/';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  // Set of comments to display
  @Input() comments: Comment[];

  //ID of Story
  @Input() storyID: number;

  //When new comment posted
  @Output() commentPosted: EventEmitter<number> = new EventEmitter();

  //Columns for tabulated comments
  columns:string[] = ['ProfilePic','Data'];

  constructor(
    private _storyService: StoryService,
    public _authService: AuthService
  ) { }

  ngOnInit() {
  }

  getNewCommentData(){
    //call story service and update Comments data
    this._storyService.getComments(this.storyID).then((data) => {
      let commentData = data as Comment[];

      //Get display time for comment
      for (let i = 0; i < commentData.length; i++){
        let new_ts = this.get_created_ts(commentData[i].created_ts);
        console.log("New ts: ", new_ts);
        commentData[i].created_ts = new_ts;
      }

  //    console.log("Comment data: ", commentData);
      this.comments = commentData;
    })
  }

  newCommentPosted(){
    //this.getNewCommentData();
    this.commentPosted.emit(this.storyID);
  }

  public get_created_ts(timestamp){
    var date = new Date();
    var ts = date.getTime() / 1000;
    var secondsPerMinute = 60;
    var secondsPerHour = secondsPerMinute * 60;
    var secondsPerDay = secondsPerHour * 24;

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
    else {
      displayTime = Math.round((ts - timestamp) / secondsPerDay) + "d";
    }
    return displayTime;
  }

}

interface Comment {
  display_name:string;
  username: string;
  profile_url:string;
  message:string;
  created_ts:number;
}
