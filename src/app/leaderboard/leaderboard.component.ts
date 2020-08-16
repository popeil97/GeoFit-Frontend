import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  private columns:string[] = ['Rank','ProfilePic','Name','Distance','Follow'];
  @Input() leaderboard:LeaderboardItem[];
  @Input() allowFollow: Boolean = false;

  constructor() {
  }

  ngOnInit() {

  }


}

export interface LeaderboardItem {
  rank: number,
  name: string,
  profile_url: string,
  total_distance:number;
  total_time:number;
}
