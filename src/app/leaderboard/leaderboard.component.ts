import { Component, OnInit, Input, SimpleChanges,OnChanges } from '@angular/core';
import { 
  LeaderboardService 
} from '../services';

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
  public myPos: LeaderboardItem;

  private initialized: boolean = false;
  private page:number = 1;
  public showMore = false;
  public leaderboardOpen = false;
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

  toggleLeaderboardOpen()
  {
    this.leaderboardOpen = !this.leaderboardOpen;
  }

  toggleDetails()
  {
    this.showMore = !this.showMore;
  }

  getLeaderboard(){
    let leaderboardData:LeaderboardStruct = {} as LeaderboardStruct;
    console.log("GETTING LEADERBOARD", this.tagID);

    this.page = 1;
    
    if (this.use == 'individual' && this.tagID != 0){ // and tagID != all_id
      this._leaderboardService.getIndividualLeaderboard(this.page,this.tagID != -1 ? this.tagID : null).then((data) => {
        leaderboardData = data as LeaderboardStruct;
        this.leaderboard = leaderboardData.leaderboard;

          // set my current leaderboard position to myPos
        this.myPos = leaderboardData.user_leaderboard_stat;
            
        if(this.myPos != null && this.myPos != undefined) {
          this.myPos.rank = leaderboardData.user_rank;
        }
        
      })

    }

    else if (this.use == 'teams' && this.tagID != 0){ // and tagID != all_id
      this._leaderboardService.getTeamLeaderboard(this.page,this.tagID != -1 ? this.tagID : null).then((data) => {
        leaderboardData = data as LeaderboardStruct;
        this.leaderboard = leaderboardData.leaderboard;

        // set my current leaderboard position to myPos
        this.myPos = leaderboardData.user_leaderboard_stat;
            
        if(this.myPos != null && this.myPos != undefined) {
          this.myPos.rank = leaderboardData.user_rank;
        }
      });
      
    }

    else {
      // get all tag cumulative leaderboard
      this._leaderboardService.getOrganizationLeaderboard().then((resp:any) => {
        console.log('ALL LEADERBOARD:',resp);
        this.leaderboard = resp.organization_leaderboard;

      })
    }

    // set my current leaderboard position to myPos
    this.myPos = leaderboardData.user_leaderboard_stat;
        
    if(this.myPos != null && this.myPos != undefined) {
      this.myPos.rank = leaderboardData.user_rank;
    }

    console.log("YEEE",leaderboardData);
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
  user_leaderboard_stat:LeaderboardItem;
  user_rank:number;
}
