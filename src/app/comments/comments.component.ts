import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoryService } from '../story.service';
import { AuthService } from '../auth.service';

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

  constructor(private _storyService: StoryService,
              public _authService: AuthService) { }

  ngOnInit() {
  }

  getNewCommentData(){
    console.log("getting new comment data");

    //call story service and update Comments data
    this._storyService.getComments(this.storyID).then((data) => {
      let commentData = data as Comment[];
      console.log("Comment data: ", commentData);
      this.comments = commentData;
    })
  }

  newCommentPosted(){
    //this.getNewCommentData();
    
    this.commentPosted.emit(this.storyID);
  }

}

interface Comment {
  display_name:string;
  username: string;
  profile_url:string;
  message:string;
  created_ts:number;
}
