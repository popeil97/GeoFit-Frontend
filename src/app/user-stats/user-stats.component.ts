import { Component, OnInit, Input} from '@angular/core';
import { UsersService } from '../users.service';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css'],
})
export class UserStatsComponent implements OnInit {
  
  @Input() userData;
  @Input() userID: number;
  userStats: UserStats;
  private chart: Chart;
  
  public currentScreen = 'run';
  public acceptedScreens = ['run','walk','bike'];

  constructor(
    private _usersService:UsersService
  ) {}

  ngOnInit() {
    this._usersService.getUserStats(this.userID)
    .then((res)=>{
      // console.log("USER", this.userID,"STATS: ", res);
      this.userStats = res as UserStats;
      //  console.log("STATS",this.userStats);
      //this.userStats.mycolors
      this.showChart(this.userStats.mydates,this.userStats.run_dists,this.userStats.walk_dists, this.userStats.bike_dists, this.userStats.other_dists);
    })
    .catch(err=>{
      console.log("CACHMEOUSIDE");
      console.error(err);
    })

    document.getElementById('run-btn').style.backgroundColor = "#36343c";
    document.getElementById('run-btn').style.color = "#FFFFFF";
  }

  private showChart(mydates,run_dists,walk_dists,bike_dists,other_dists) {
    var data = [];
    
    if(run_dists.length>0) {
      data.push({
        label: 'Run',
        data: run_dists,
        backgroundColor: 'rgba(127 , 204 ,146,0.2)',
        borderColor: 'rgba(127 , 204 ,146,1)',
        borderWidth: 1
      });
    }
    
    if(walk_dists.length>0) {
      data.push({
        label: 'Walk',
        data: walk_dists,
        backgroundColor: 'rgba(54, 52 , 60,0.2)',
        borderColor: 'rgba(54 ,52 , 60,1)',
        borderWidth: 1
      });
    }
    
    if(bike_dists.length>0) {
      data.push({
        label: 'Ride',
        data: bike_dists,
        backgroundColor: 'rgba( 237 ,106 ,17,0.2)',
        borderColor: 'rgba( 237 ,106 ,17,1)',
        borderWidth: 1
      });
    }

    if(other_dists.length>0) {
      data.push({
        label: 'Other',
        data: other_dists,
        backgroundColor: 'rgba(255, 179, 102,0.2)',
        borderColor: 'rgba(255, 179, 102,1)',
        borderWidth: 1
      });
    }
    
    // console.log("DATA", data);
    
    this.chart = new Chart('lineCharts', {
      type: 'bar',
      data: {
        labels: mydates,
        datasets: data,
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    });
  }
  
  private openStats(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

	private openTab() {
	  document.getElementById("defaultOpen").click();
	}

  SwitchSlideshow = (to:string = null) => {
    //console.log("to", to, this.acceptedScreens.indexOf(to));
    if (to == null || this.acceptedScreens.indexOf(to) == -1) return;
    this.currentScreen = to;

    document.getElementById(to+'-btn').style.backgroundColor = "#36343c";
    document.getElementById(to+'-btn').style.color = "#FFFFFF";

    switch(to) { 
      case 'run': 
        document.getElementById('walk-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('walk-btn').style.color = "#000000";
        document.getElementById('bike-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('bike-btn').style.color = "#000000";
        break; 
      case 'walk': 
        document.getElementById('run-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('run-btn').style.color = "#000000";
        document.getElementById('bike-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('bike-btn').style.color = "#000000";
        break; 
      case 'bike':
        document.getElementById('walk-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('walk-btn').style.color = "#000000";
        document.getElementById('run-btn').style.backgroundColor = "#FFFFFF";
        document.getElementById('run-btn').style.color = "#000000";
        break; 
    }

    return;
  }

}

interface UserStats {
  
  run_tot_activities:number;
  run_tot_dist:number;
  run_tot_hrs:number;

  run_max_dist:number;
  run_max_time:number;
  run_max_pace:number;

  run_average_pace:number;
  run_average_dist:number;
  run_average_time:number;

  walk_tot_activities:number;
  walk_tot_dist:number;
  walk_tot_hrs:number;

  walk_max_dist:number;
  walk_max_time:number;
  walk_max_pace:number;

  walk_average_pace:number;
  walk_average_dist:number;
  walk_average_time:number;

  ride_tot_activities:number;
  ride_tot_dist:number;
  ride_tot_hrs:number;

  ride_max_dist:number;
  ride_max_time:number;
  ride_max_pace:number;

  ride_average_pace:number;
  ride_average_dist:number;
  ride_average_time:number;

  mydates:any[];
  run_dists:any[];
  walk_dists:any[];
  bike_dists:any[];
  other_dists:any[];
}