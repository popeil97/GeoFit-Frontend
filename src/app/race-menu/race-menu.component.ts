import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Activity } from '../strava-entry/strava-entry.component';

@Component({
  selector: 'app-race-menu',
  templateUrl: './race-menu.component.html',
  styleUrls: ['./race-menu.component.css']
})
export class RaceMenuComponent implements OnInit {
  @Input() activities:Activity[];
  @Input() socialFeed:any[];
  @Input() leaderboard:any[];

  @Output() importActs: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
