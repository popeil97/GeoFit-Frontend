import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { LeaderboardService } from '../leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  //@Input() leaderboard:LeaderboardItem[];

  //Can be 'teams' or 'individual'
  @Input() use: string;
  @Input() raceID: number;
  @Input() allowFollow: Boolean = false;

  private columns:string[] = ['Rank','ProfilePic','Name','Distance','Follow'];
  private leaderboard: LeaderboardItem[];

  private initialized: boolean;

  constructor(private _leaderboardService: LeaderboardService) {
  }

  ngOnInit() {
    this._leaderboardService.raceID = this.raceID;
    this.getLeaderboard();

    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    //Check if user or race ID changes between hops
    //If yes, we need to pull new data

    if (this.initialized){
      for(const propName in changes) {
        if(changes.hasOwnProperty(propName)) {

          switch(propName) {
            case 'raceID':
              if(changes.ID.currentValue != undefined) {
                this._leaderboardService.raceID = this.raceID;
                this.getLeaderboard();
              }
          }
        }
      }
    }

  }

  getLeaderboard(){
    var leaderboardData;
    console.log("GETTING LEADERBOARD");
    console.log(this._leaderboardService.raceID);
    console.log(this.use);
    if (this.use == 'individual'){
      this._leaderboardService.getIndividualLeaderboard().then((data) => {
        leaderboardData = data as LeaderboardStruct;
        console.log("Leaderboard data: ", leaderboardData);
        this.leaderboard = this.configureLeaderboard(leaderboardData.unranked,leaderboardData.ranked);;
      })
    }
    else if (this.use == 'teams'){
      this._leaderboardService.getTeamLeaderboard().then((data) => {
        leaderboardData = data as LeaderboardStruct;
        console.log("Leaderboard data: ", leaderboardData);
        this.leaderboard = this.configureLeaderboard(leaderboardData.unranked,leaderboardData.ranked);;
      })
    }

  }

  configureLeaderboard(ranked:any[],unranked:any[]) {
    console.log("RANKE BOARD:",unranked.concat(ranked));
    return unranked.concat(ranked)
  }

}

export interface LeaderboardItem {
  rank: number,
  name: string,
  profile_url: string,
  total_distance:number;
  total_time:number;
}

export interface LeaderboardStruct {
  ranked: LeaderboardItem[];
  unranked: LeaderboardItem[];
}
