import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-story-delete-dialog',
  templateUrl: './story-delete-dialog.component.html',
  styleUrls: ['./story-delete-dialog.component.css']
})
export class StoryDeleteDialogComponent implements OnInit {
  private storyID: number;

  constructor(
    private _storyService: StoryService,
    public dialogRef: MatDialogRef<StoryDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.storyID = data.storyID;
  }

  ngOnInit() {
  }

  public deleteStory(){
    this._storyService.deleteStory(this.storyID).then(() => {
      this.closeDialog(true);
    })
  }

  private closeDialog(deleted: boolean){
    this.dialogRef.close({'deleted': deleted});
  }

}
