import { Component, OnInit, Input } from '@angular/core';
import { UserProfileService } from '../userprofile.service';

@Component({
  selector: 'app-user-profile-nav',
  templateUrl: './user-profile-nav.component.html',
  styleUrls: ['./user-profile-nav.component.css']
})
export class UserProfileNavComponent implements OnInit {
  @Input() username: string;

  constructor(private _userProfileService: UserProfileService) { }

  ngOnInit() {
  }

  goToUserProfile(){
    this._userProfileService.goToUserProfile(this.username);
  }

}
