import { Component, OnInit } from '@angular/core';
import { RaceFeedService } from './race-feed.service';

@Component({
  selector: 'app-race-feed',
  templateUrl: './race-feed.component.html',
  styleUrls: ['./race-feed.component.css']
})
export class RaceFeedComponent implements OnInit {

  constructor(private _raceFeedService : RaceFeedService) { }

  ngOnInit() {
  }

  public refreshFeed(){
    this._raceFeedService.refreshFeed().then(data => {
      console.log(data);
    });
  }

}
