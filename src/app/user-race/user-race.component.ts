import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-user-race',
  templateUrl: './user-race.component.html',
  styleUrls: ['./user-race.component.css']
})
export class UserRaceComponent implements OnInit {
  @Input() userData: UserData;
  constructor() { }

  ngOnInit() {
  	console.log(this.userData);

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
  location_visibility:boolean;
  about_visibility:boolean;
  email_visibility:boolean;
}