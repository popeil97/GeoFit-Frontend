import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserProfileService } from '../userprofile.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  private username;

  private userData: any[];

  private feedItems: FeedObj[];

  constructor(private route:ActivatedRoute, private _userProfileService:UserProfileService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params['params']['username'];
    });

    this.getUserData();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('changes:',changes);

  //   for(const propName in changes) {
  //     if(changes.hasOwnProperty(propName)) {

  //       switch(propName) {
  //         case 'username':
  //           if(changes.username.currentValue != undefined) {
  //             this.getUserData();
  //           }
  //       }
  //     }
  //   }
  // }

  getUserData(){
    console.log(this.username);
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.getUserProfile(this.username).then((data) => {
      let userData = data as UserData;
      console.log(userData);
      this.feedItems = userData.feed;
    });

  }

}

interface UserData {
  feed:any;
  email:any;
  first_name:any;
  last_name:any;
}

interface FeedObj {
  user_id: number;
  display_name: string;
  profile_url:string
  joined: boolean;
  traveled: boolean;
  story: boolean;
  story_image:string;
  story_text:string;
  total_distance:number;
  last_distance:number;
  message: string;
  created_ts:number;
}
