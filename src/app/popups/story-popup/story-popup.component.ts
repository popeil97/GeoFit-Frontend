import { NgModule, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { 
  AuthService,
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
export class StoryPopupComponent {

  constructor(
    private authService:AuthService,
    private dialogRef:MatDialogRef<StoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:FeedObj,
  ) { }

  closeDialog() {
    this.dialogRef.close();
  }


}
