import { NgModule, Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { 
  UserProfileService,
} from '../services';
import { UsersService } from '../users.service';

@NgModule({
  imports:[MatDialogRef]
})
@Component({
  selector: 'app-view-follow',
  templateUrl: './view-follow.component.html',
  styleUrls: ['./view-follow.component.css']
})
export class ViewFollowComponent implements OnInit,OnDestroy {

  public followers:any[] = [];
  public followed: any[];
  public follow_bool: any[];
  public numFollowers: number = 0;
  public numFollowing: number;

  private currentScreen:string = 'followers';
  private slides = ['followers','following'];

  constructor(
    //public dialog: MatDialog,
    private _userService:UsersService,

    public dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef:MatDialogRef<ViewFollowComponent>,
  ) {
    this.followers = this.data.followersData.followers;
    this.numFollowers = this.data.followersData.numFollowers;
    this.followed = this.data.followersData.followed;
    this.numFollowing = this.data.followersData.numFollowing;
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.followers = [];
    this.numFollowers = 0;
    this.followed = [];
    this.numFollowing = 0;
  }

  SwitchSlideshow = (slide:string) => {
    if (this.slides.indexOf(slide) > -1) this.currentScreen = slide;

     document.getElementById(slide+'-btn').style.backgroundColor = "#36343c";
     document.getElementById(slide+'-btn').style.color = "#FFFFFF";

    switch(slide) { 
     case 'followers': { 
       document.getElementById('following-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('following-btn').style.color = "#000000";
        break; 
     } 
     case 'following': { 
        document.getElementById('followers-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('followers-btn').style.color = "#000000";
        break; 
     } 
   }
  }

  closeDialog = () => {
    this.dialogRef.close();
  }
}


/*
@Component({
  selector: 'app-view-follow-dialog-content',
  templateUrl: './view-follow-dialog-content.html',
})

export class ViewFollowDialogContent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewFollowDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close(ViewFollowDialogContent);
  }
}

interface FollowersResp {
  followed: any[];
  followers:any[];
}
*/