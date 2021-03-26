import { NgModule, Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { 
  AuthService,
  StoryService,
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
    private dialogRef:MatDialogRef<StoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:FeedObj,
  ) {}

    ngOnInit() {
      this.storyData = this.data;
    }

  newCommentPosted = (e:any):void => {
    console.log(e);
    this.storyService.getStoryModalData(this.storyData.story_id).then((updatedPost) => {
      this.storyData = updatedPost as FeedObj;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
