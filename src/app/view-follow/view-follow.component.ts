import { UserProfileService } from '../userprofile.service';
import { UsersService } from '../users.service';
import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-view-follow',
  templateUrl: './view-follow.component.html',
  styleUrls: ['./view-follow.component.css']
})
export class ViewFollowComponent implements OnInit {

  constructor( public dialog: MatDialog,private _userService:UsersService,) { }

  public followers:any[];
  public followed: any[];
  public follow_bool: any[];
  public numFollowers: number;
  public numFollowing: number;

  ngOnInit() {

  	  this._userService.getFollowersAndFollowedSeperate().then((resp:FollowersResp) => {
      this.followers = resp.followers;
      this.followed = resp.followed;
      this.numFollowers = this.followers.length;
      this.numFollowing = this.followed.length;
    });

  }

   openDialog() {

    const dialogRef = this.dialog.open(ViewFollowDialogContent,{disableClose: false, data:{followers:this.followers,following:this.followed} as MatDialogConfig});

  }


}

@Component({
  selector: 'app-view-follow-dialog-content',
  templateUrl: './view-follow-dialog-content.html',
})

export class ViewFollowDialogContent {

  constructor(public dialogRef: MatDialogRef<ViewFollowDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }


}



interface FollowersResp {
  followed: any[];
  followers:any[];

}
