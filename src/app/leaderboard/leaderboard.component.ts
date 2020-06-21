import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  private columns:string[] = ['Rank','Name','Distance'];
  @Input() leaderboard:LeaderboardItem[];

  constructor() { }

  ngOnInit() {
  }


}

export interface LeaderboardItem {
  rank: number,
  total_distance:number;
  total_time:number;
}
