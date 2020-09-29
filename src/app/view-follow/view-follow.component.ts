import { UserProfileService } from '../userprofile.service';
import { UsersService } from '../users.service';
import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { ModalService } from '../modalServices';

@Component({
  selector: 'app-view-follow',
  templateUrl: './view-follow.component.html',
  styleUrls: ['./view-follow.component.css']
})
export class ViewFollowComponent implements OnInit {

  @Input() id: string;

  constructor(
    //public dialog: MatDialog,
    private _userService:UsersService,
    private modalService: ModalService,
  ) {}

  public followers:any[];
  public followed: any[];
  public follow_bool: any[];
  public numFollowers: number;
  public numFollowing: number;

  private currentScreen:string = 'followers';
  private slides = ['followers','following'];

  ngOnInit() {
    /*
  	this._userService.getFollowersAndFollowedSeperate().then((resp:FollowersResp) => {
      this.followers = resp.followers;
      this.followed = resp.followed;
      this.numFollowers = this.followers.length;
      this.numFollowing = this.followed.length;
    });
    */
  }
  
  /*
  openDialog() {
    const dialogRef = this.dialog.open(ViewFollowDialogContent,{disableClose: false, data:{followers:this.followers,following:this.followed} as MatDialogConfig});
  }
  */

  SwitchSlideshow = (slide:string) => {
    if (this.slides.indexOf(slide) > -1) this.currentScreen = slide;
  }

  get d() {

    const data = this.modalService.getModalData(this.id);
    console.log("DATA", data);
    return data;
  }

  closeDialog = () => {
    this.modalService.close(this.id);
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