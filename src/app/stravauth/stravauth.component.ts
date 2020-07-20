import { Component, OnInit } from '@angular/core';
import { StravauthService } from './stravauth.service';

@Component({
  selector: 'app-stravauth',
  templateUrl: './stravauth.component.html',
  styleUrls: ['./stravauth.component.css']
})
export class StravauthComponent implements OnInit {

  //store strava user details for display
  public stravaData: StravaData;

  constructor(private _stravauthService: StravauthService) { }

  ngOnInit() {
    this.getStravaInfo();
  }

  public authenticate(){
    this._stravauthService.authenticate();
  }

  getStravaInfo() {
    this._stravauthService.getStravaInfo().then( data => {
      this.stravaData = data as StravaData;
    })
  }

  revokeAccess() {
    this._stravauthService.deauthorize().then( data => {
      if (data['success']){
        this.getStravaInfo();
      }
    });
  }

}

interface StravaData{
  authorized: boolean;
  ID: number;
}
