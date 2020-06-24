import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../users.service'

@Component({
  selector: 'app-user-follow',
  templateUrl: './user-follow.component.html',
  styleUrls: ['./user-follow.component.css']
})
export class UserFollowComponent implements OnInit {
  // ID of user we follow/unfollow
  @Input() userID : number;

  // TRUE if we follow them, FALSE if we do not follow them
  @Input() follows: boolean;

  constructor(private _userService:UsersService) {
  }

  ngOnInit() {
  }

  changeLikeStatus(){
    if (this.follows){
      console.log("unfollowing user ", this.userID);
      this._userService.unfollowUserWithID(this.userID);
    }
    else {
      console.log("following user ", this.userID);

      this._userService.followUserWithID(this.userID);
    }

    this.follows = !this.follows;
  }

}
