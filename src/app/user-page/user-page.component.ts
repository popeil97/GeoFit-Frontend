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

  private userData: UserData;

  constructor(private route:ActivatedRoute, private _userProfileService:UserProfileService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params['params']['username'];
      this.getUserData();
      console.log(this.username);
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:',changes);

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'username':
            if(changes.username.currentValue != undefined) {
              this.getUserData();
            }
        }
      }
    }
  }

  getUserData(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.getUserProfile(this.username).then((data) => {
      this.userData = data as UserData;
    });

  }

}

interface UserData {
  user_id:number;
  profile_url:string;
  email:string;
  first_name:string;
  last_name:string;
  follows:boolean;
}

