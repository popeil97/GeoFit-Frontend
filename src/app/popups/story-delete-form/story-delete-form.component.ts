import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { 
  StoryService 
} from '../../services';

@Component({
  selector: 'app-story-delete-form',
  templateUrl: './story-delete-form.component.html',
  styleUrls: [
    './story-delete-form.component.css',
    '../../../styles/forms.css'
  ]
})
export class StoryDeleteFormComponent {
  private storyID: number;

  constructor(
    private _storyService: StoryService,
    public dialogRef: MatDialogRef<StoryDeleteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.storyID = data.storyID;
  }

  public deleteStory(){
    this._storyService.deleteStory(this.storyID).then(() => {
      this.closeDialog(true);
    })
  }

  public closeDialog(deleted: boolean){
    this.dialogRef.close({'deleted': deleted});
  }

}
