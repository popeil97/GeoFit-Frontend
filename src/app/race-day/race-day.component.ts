import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../userprofile.service';

@Component({
  selector: 'app-race-day',
  templateUrl: './race-day.component.html',
  styleUrls: ['./race-day.component.css']
})
export class RaceDayComponent implements OnInit {
  username;
  userData: UserData;

  constructor(public dialog: MatDialog, private _authService: AuthService,private route:ActivatedRoute, 
    private router:Router, private _userProfileService:UserProfileService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params['params']['username'];
      this.getUserData();
      console.log("USER",this.username);
    });
  }
  getUserData(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.getUserProfile(this.username).then((data) => {
      this.userData = data as UserData;
      console.log("New user data2: ", this.userData);

      if (this.userData.location =="")
      {
        this.userData.location = "N/A";
      }

      if (this.userData.description =="")
      {
        this.userData.description = "N/A";
      }
    });
  }

  profileUpdated($event) {
    //Get new data
    this.getUserData();
  }
  openDialog() {

    const dialogRef = this.dialog.open(RaceDayDialogContent,{disableClose: false, data:{} as MatDialogConfig});

  }

}

@Component({
  selector: 'app-race-day-dialog-content',
  templateUrl: './race-day-dialog-content.html',
})

export class RaceDayDialogContent {

  public userData:any;
  public profileUpdated:any;


  constructor(public dialogRef: MatDialogRef<RaceDayDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

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

