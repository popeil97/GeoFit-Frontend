  
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { 
  StoryService 
} from '../services';

@Component({
  selector: 'app-story-dialog',
  templateUrl: './story-dialog.component.html',
  styleUrls: ['./story-dialog.component.css']
})
export class StoryDialogComponent implements OnInit {

  public elementData: FeedObj;
  public showComments: boolean;

  constructor(public dialogRef: MatDialogRef<StoryDialogComponent>,
          @Inject(MAT_DIALOG_DATA) public data: any, private _storyService:StoryService) {
            this.elementData = data.element;
            this.showComments = data.showComments;
           }

  ngOnInit() {
  }

  newCommentPosted(): void {
    this._storyService.getStoryModalData(this.elementData.story_id).then((updatedPost) => {
      this.elementData = updatedPost as FeedObj;
    });
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
}