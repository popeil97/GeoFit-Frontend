import { Component, OnInit ,Input} from '@angular/core';
import { UserProfileService } from '../userprofile.service';

@Component({
  selector: 'app-show-followers',
  templateUrl: './show-followers.component.html',
  styleUrls: ['./show-followers.component.css']
})
export class ShowFollowersComponent implements OnInit {

  @Input() person:any;
  userData: UserData;
  picURL:any;
  follows:any

  constructor(private _userProfileService:UserProfileService,) { }

  ngOnInit() {
  	this.getUserData();
  }


  getUserData(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.requestUserProfile(this.person.username).then((data) => {
      this.userData = data as UserData;
      this.picURL = this.userData.profile_url;
      this.follows = this.userData.follows;
    //   console.log("FOLLOW New user data: ", this.userData);
    });
  }

}



interface UserData {
  user_id:number;
  profile_url:string;
  email:string;
  description: string;
  location:string;
  first_name:string;
  last_name:string;
  follows:boolean;
  distance_type: string;
  is_me: boolean;
}
