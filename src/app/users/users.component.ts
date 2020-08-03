import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {throwError} from 'rxjs';
import $ from "jquery";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  /**
   * An object representing the user for the login form
   */
  public user: any;
  public coords:any;
  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: ''
    };

    // this.all_user_data[0] = {"child_user_stats": null,
    //       "display_name": "kdonahoe2",
    //       "distance_type": "MI",
    //       "follows": false,
    //       "isMe": true,
    //       "isTeam": false,
    //       "profile_url": "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
    //       "race_id": 3,
    //       "rank": null,
    //       "team_id": null,
    //       "total_distance": 0,
    //       "total_time": 0,
    //       "user_id": 4}
    this.coords = {"route1":{"coords": [[
        -101.1181641,
        40.9505991
      ],
      [
        -104.5019531,
        42.4916428
      ],
      [
        -110.6982422,
        42.0364751
      ],
      [
        -111.8847656,
        37.7583815
      ],
      [
        -106.875,
        31.0980874
      ],
      [
        -100.546875,
        28.8530335
      ],
      [
        -93.1640625,
        34.1318242
      ],
      [
        -88.9013672,
        38.2775367
      ],
      [
        -90.3955078,
        41.5122633
      ],
      [
        -94.9658203,
        42.3619303
      ],
      [
        -97.6464844,
        41.971183
      ],
      [
        -100.4150391,
        40.6179565
      ],
      [
        -101.1181641,
        40.9505991
      ]], "distance": 2602029.176518327}};
    console.log('LANDING COORDS:',this.coords);
    //If we already store a JWT locally, set it in memory
    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

  }

  logout() {
    this._authService.logout();
  }


/**
* Template Name: Mamba - v2.3.0
* Template URL: https://bootstrapmade.com/mamba-one-page-bootstrap-template-free/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/


}



