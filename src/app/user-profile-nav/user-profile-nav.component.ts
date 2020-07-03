import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserProfileService } from '../userprofile.service';

declare var $: any;

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
    //Close modals etc to ensure website works as intended
    if (document.getElementById('close-modal')){
      document.getElementById('close-modal').click();
    }

    this._userProfileService.goToUserProfile(this.username);
  }

}
