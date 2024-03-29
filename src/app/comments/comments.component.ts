import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoryService } from '../story.service';

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

  //Columns for tabulated comments
  private columns:string[] = ['ProfilePic','Data'];

  constructor(private _storyService: StoryService) { }

  ngOnInit() {
  }

  getNewCommentData(){
    console.log("getting new comment data");

    //call story service and update Comments data
    this._storyService.getComments(this.storyID).then((data) => {
      let commentData = data as Comment[];
      this.comments = commentData;
    })
  }

}

interface Comment {
  display_name:string;
  profile_url:string;
  message:string;
  created_ts:number;
}
