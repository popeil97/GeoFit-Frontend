import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { 
  LeaderboardService,
 } from '../services';

@Component({
  selector: 'app-hybrid-leaderboard',
  templateUrl: './hybrid-leaderboard.component.html',
  styleUrls: ['./hybrid-leaderboard.component.css']
})
export class HybridLeaderboardComponent implements OnInit,OnChanges {

  @Input() raceID:number = undefined;

  public leaderboard:any[] = [];
  private page:number = 1;
  public showMore = false;

  constructor(
    private _leaderboardService:LeaderboardService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    for(const propName in changes) {
        if(changes.hasOwnProperty(propName)) {
          console.log('HYBRID PROPNAME:',propName);
          switch(propName) {
            case 'raceID':
              console.log('GOT NEW RACEID FROM HYBRID LEADERBOARD',changes.raceID);
              if(changes.raceID.currentValue != undefined) {
                
                this.getLeaderboard();
              }

          }
        }
        
      }
  }

  ngOnInit() {
    console.log('INIT FROM HYBRID LEADERBOARD');
    if(this.raceID != undefined) {
      this.getLeaderboard();
    }
  }

  toggleDetails()
  {
    this.showMore = !this.showMore;
  }

  public getLeaderboard() {
    this.page = 1;
    this._leaderboardService.getHybridLeaderboard(this.raceID,this.page).then((resp:any) => {
      console.log('HYRBID LEADERBOARD IS:',resp);
      this.leaderboard = resp['leaderboard'];
      this.page++;
    });
  }

  public getNextPage() {
    this._leaderboardService.getHybridLeaderboard(this.raceID,this.page).then((resp:any) => {
      console.log('HYRBID LEADERBOARD IS:',resp);
      this.leaderboard = this.leaderboard.concat(resp['leaderboard']);
      this.page++;
    });
  }

}
