import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserProfileService } from '../userprofile.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  userData: UserData;
  constructor(public _authService: AuthService,
    private _userProfileService: UserProfileService) { }

  ngOnInit() {

  	if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

    if (localStorage.getItem('loggedInUsername')){
      this._authService.username = localStorage.getItem('loggedInUsername');

      this._userProfileService.getUserProfile(this._authService.username).then((data) => {
      this.userData = data as UserData;
      
    });

    }



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

