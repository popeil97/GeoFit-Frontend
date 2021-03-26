  
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { 
  StoryService 
} from '../services';
import {
  FeedObj
} from '../models';

@Component({
  selector: 'app-story-dialog',
  templateUrl: './story-dialog.component.html',
  styleUrls: ['./story-dialog.component.css']
})
export class StoryDialogComponent {

  public elementData: FeedObj;
  public showComments: boolean;

  constructor(
    public dialogRef: MatDialogRef<StoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _storyService:StoryService
  ) {
    this.elementData = data.element;
    this.showComments = data.showComments;
  }

  newCommentPosted(): void {
    this._storyService.getStoryModalData(this.elementData.story_id).then((updatedPost) => {
      this.elementData = updatedPost as FeedObj;
    });
  }

}