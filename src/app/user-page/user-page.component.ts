import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserProfileService } from '../userprofile.service';

declare var $: any;

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  private username;
  private userData: UserData;
<<<<<<< HEAD
  constructor(private route:ActivatedRoute, private _userProfileService:UserProfileService) { }

  ngOnInit() {
  	
    //openTab();
=======
  private showEdit: boolean;

  constructor(private route:ActivatedRoute, private _userProfileService:UserProfileService) { }

  ngOnInit() {
    //Don't show edit page by default
    this.showEdit = false;

>>>>>>> 4723003eb2f605686f4a9ddd96592b21fccce748
    this.route.paramMap.subscribe(params => {
      this.username = params['params']['username'];
      this.getUserData();
      console.log(this.username);
    });

<<<<<<< HEAD
    this.getUserData();


=======
>>>>>>> 4723003eb2f605686f4a9ddd96592b21fccce748
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

<<<<<<< HEAD
=======
  toggleEditView(): void{
    this.showEdit = !this.showEdit;
  }

  profileUpdated($event) {
    //Get new data
    this.getUserData();

    //Switch back to main view
    this.toggleEditView();
  }
>>>>>>> 4723003eb2f605686f4a9ddd96592b21fccce748

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
}

