import { Component, OnInit, Input } from '@angular/core';
import { StoryService } from '../story.service';
import {MatTooltipModule} from '@angular/material';

@Component({
  selector: 'app-story-btn',
  templateUrl: './story-btn.component.html',
  styleUrls: ['./story-btn.component.css']
})
export class StoryBtnComponent implements OnInit {
  // ID of story we like/unlike/delete
  @Input() storyID : number;

  // Use of this button. Can be 'like' or 'delete'
  @Input() use: string;

  // TRUE if user likes this story, else FALSE
  @Input() likes: boolean;

  // Count of number of likes this story has
  @Input() likesCount: number;

  // List of users that like this story
  @Input() likesUsers: string[];

  private likesUsersString:string;

  constructor(private _storyService:StoryService) {

  }

  ngOnInit() {
    this.likesUsersString = this.likesUsers.join(', ');
  }

  changeLikeStatus(){
    if (this.likes){
      this._storyService.changeLikeStatus(this.storyID);
      this.likesCount -= 1;
    }

    else {
      this._storyService.changeLikeStatus(this.storyID);
      this.likesCount += 1;
    }

    this.likes = !this.likes;
  }

  deleteStory(){
//     console.log("Deleting story");
    this._storyService.deleteStory(this.storyID);
  }

}
