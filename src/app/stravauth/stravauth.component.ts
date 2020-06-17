import { Component, OnInit } from '@angular/core';
import { StravauthService } from './stravauth.service';

@Component({
  selector: 'app-stravauth',
  templateUrl: './stravauth.component.html',
  styleUrls: ['./stravauth.component.css']
})
export class StravauthComponent implements OnInit {

  //store strava user details for display
  private stravaUser;

  constructor(private _stravauthService: StravauthService) { }

  ngOnInit() {
  }

  public authenticate(){
    this._stravauthService.authenticate();
  }

}
