import { Component, OnInit, Input, SimpleChanges,OnChanges } from '@angular/core';
import { LeaderboardService } from '../leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit,OnChanges {
  //@Input() leaderboard:LeaderboardItem[];

  //Can be 'teams' or 'individual'
  @Input() use: string;
  @Input() raceID: number;
  @Input() allowFollow: Boolean = false;
  @Input() tagID:any = null; // just in case it gets initialized to 0

  public columns:string[] = ['Rank','ProfilePic','Name','Distance','Follow'];
  public leaderboard: LeaderboardItem[];

  private initialized: boolean = false;
  private page:number = 1;

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

            case 'tagID':
              this.getLeaderboard(); // get leaderboard for tags

          }
        }
        
      }
    }

  }

  getLeaderboard(){
    var leaderboardData;
    console.log("GETTING LEADERBOARD", this.tagID);

    this.page = 1;
    
    if (this.use == 'individual' && this.tagID != 0){ // and tagID != all_id
      this._leaderboardService.getIndividualLeaderboard(this.page,this.tagID != -1 ? this.tagID : null).then((data) => {
        leaderboardData = data as LeaderboardStruct;
        this.leaderboard = leaderboardData.leaderboard;
        
      })

      console.log("YEEE",this.leaderboard);
    }

    else if (this.use == 'teams' && this.tagID != 0){ // and tagID != all_id
      this._leaderboardService.getTeamLeaderboard(this.page,this.tagID != -1 ? this.tagID : null).then((data) => {
        leaderboardData = data as LeaderboardStruct;
        this.leaderboard = leaderboardData.leaderboard;
      })
    }

    else {
      // get all tag cumulative leaderboard
      this._leaderboardService.getOrganizationLeaderboard().then((resp:any) => {
        console.log('ALL LEADERBOARD:',resp);
        this.leaderboard = resp.organization_leaderboard;
      })
    }

    this.page++;

  }

  getNextLeaderboardPage() {
    var leaderboardData;
    if (this.use == 'individual' && this.tagID != 0){ // and tagID != all_id
      this._leaderboardService.getIndividualLeaderboard(this.page,this.tagID != -1 ? this.tagID : null).then((data) => {
        leaderboardData = data as LeaderboardStruct;
        let leaderboardPage = leaderboardData.leaderboard;
        this.leaderboard = this.leaderboard.concat(leaderboardPage);
      })
    }

    else if (this.use == 'teams' && this.tagID != 0){ // and tagID != all_id
      this._leaderboardService.getTeamLeaderboard(this.page,this.tagID != -1 ? this.tagID : null).then((data) => {
        leaderboardData = data as LeaderboardStruct;
        let leaderboardPage = leaderboardData.leaderboard;
        this.leaderboard = this.leaderboard.concat(leaderboardPage);
      })
    }

    this.page++;
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
  leaderboard: LeaderboardItem[];
}
