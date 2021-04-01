import { NgModule, Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { 
  AuthService,
  StoryService,
  RaceFeedService,
} from '../../services';
import {
  FeedObj
} from '../../interfaces';

@NgModule({
  imports:[MatDialogRef]
})


@Component({
  selector: 'app-story-popup',
  templateUrl: './story-popup.component.html',
  styleUrls: ['./story-popup.component.css']
})
export class StoryPopupComponent implements OnInit {

  public storyData:FeedObj = null;

  constructor(
    private authService:AuthService,
    private storyService:StoryService,
    private raceFeedService:RaceFeedService,
    private dialogRef:MatDialogRef<StoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:FeedObj,
  ) {}

    ngOnInit() {
      console.log('STORY POPUP DATA',this.data);
      this.storyData = this.data;
    }

  newCommentPosted = (e:any):void => {
    console.log(e);
    this.storyService.getStoryModalData(this.storyData.story_id).then((updatedPost) => {
      this.storyData = updatedPost as FeedObj;
      this.raceFeedService.feedUpdated();
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
