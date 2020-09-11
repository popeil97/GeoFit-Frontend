import { Component, OnInit, Input} from '@angular/core';
import { UsersService } from '../users.service';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css'],
})
export class UserStatsComponent implements OnInit {
  @Input() userID: number;
  userStats: UserStats;
  private chart: Chart;
  constructor(private _usersService:UsersService) { }

  ngOnInit() {

  this._usersService.getUserStats(this.userID).then((res)=>{
  	console.log("USER", this.userID,"STATS: ", res);
    this.userStats = res as UserStats;
    console.log("STATS",this.userStats);
    //this.userStats.mycolors
    this.showChart(this.userStats.mydates,this.userStats.mydistances,this.userStats.mycolors);
    })
  }

   private showChart(mydates,mydistances,mycolors) {
   // var colors = ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)']
   // var colors2 = ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)']

    var colorArray = new Array(mycolors.length);
    var colorBorder = new Array(mycolors.length);
    var i;
    for (i = 0; i < mycolors.length; i++)
    {
      if(mycolors[i] == 1){ //dark blue
        colorArray[i] = 'rgba(0, 51, 204,0.2)';
        colorBorder[i] = 'rgba(0, 51, 204,1)';
      } //run
      if(mycolors[i] == 2){ //light blue
        colorArray[i] = 'rgba(153, 204, 255,0.2)';
        colorBorder[i] = 'rgba(153, 204, 255,1)';
      } //walk
      if(mycolors[i] == 3){ //pink
        colorArray[i] = 'rgba(204, 0, 204,0.2)';
        colorBorder[i] = 'rgba(204, 0, 204,1)';
      } //ride
      if(mycolors[i] == 4){ //orange
        colorArray[i] = 'rgba(255, 179, 102,0.2)';
        colorBorder[i] = 'rgba(255, 179, 102,1)';
      } //other
    //  if(mycolors[i] != 1 && mycolors.length[i] !=2){colorArray[i] = 'rgba(255, 206, 86, 0.2)';colorBorder[i] = 'rgba(255, 206, 86, 1)';}  //else
    }
    this.chart = new Chart('lineCharts', {
      type: 'bar',
      data: {

        labels: mydates,
        datasets: [{
            label: 'Distance',
            data: mydistances,
            backgroundColor: colorArray,
            borderColor: colorBorder,
            borderWidth: 1
        }
        ]
    },
    options: {
       scales: {
            xAxes: [{
               gridLines: {
                  display: false
               }
            }],
            yAxes: [{
               gridLines: {
                  display: false
               }
            }]
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

  mydistances:any[];
  mydates:any[];
  mycolors:any[];
}