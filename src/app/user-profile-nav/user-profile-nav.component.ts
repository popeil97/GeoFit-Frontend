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
  @Input() displayName: string;
  @Input() nameBreak :Boolean;

  @Output() clickedOn: EventEmitter<void> = new EventEmitter();

  constructor(private _userProfileService: UserProfileService) { }

  private first:string;
  private last:string;

  ngOnInit() {
    if(this.nameBreak)
    {
      console.log("Hi....");
      let split = this.displayName.split(" ");
      console.log("SPLIT",split);
      this.first=split[0];
      this.last =split[1];
    }
  }

  goToUserProfile(){
    //Close modals etc to ensure website works as intended
    if (document.getElementById('close-modal')){
      document.getElementById('close-modal').click();
    }

    this.clickedOn.emit();

    this._userProfileService.goToUserProfile(this.username);

  }

}
