import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { 
  RaceService,
  ReportService,
} from '../services';
import {
  StoryDeleteFormComponent
} from '../popups';
import {
  Story
} from '../interfaces';

@Component({
  selector: 'app-race-story-manage',
  templateUrl: './race-story-manage.component.html',
  styleUrls: ['./race-story-manage.component.css']
})
export class RaceStoryManageComponent implements OnChanges {
  @Input() raceID: number;

  reportedStories: Story[];
  public dataSource: any;

  constructor(
    private _raceService: RaceService,
    private _reportService: ReportService,
    public dialog: MatDialog,
  ) { }

  columns:string[] = ['ProfilePic','Data'];

  ngOnChanges(changes: SimpleChanges): void {

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'raceID':
            if(changes.raceID.currentValue != undefined) {
              this.getReportedStories();
            }
        }
      }
    }
  }

  getReportedStories(){
    this._raceService.getReportedStories(this.raceID).then((data) => {
      let stories = data as Story[];
      this.reportedStories = stories;
    //   console.log("Reported stories: ", this.reportedStories);
    })
  }

  public get_created_ts(timestamp){
    var date = new Date();
    var ts = date.getTime() / 1000;
    var secondsPerMinute = 60;
    var secondsPerHour = secondsPerMinute * 60;
    var secondsPerDay = secondsPerHour * 24;
    var secondsPerWeek = secondsPerDay * 7;

    //Calculate how to display the timestamp of the activity
    //If ts is within an hour, show number of minutes since activity
    //If ts is over an hour, round to nearest hour
    var displayTime;
    if ((ts - timestamp) < secondsPerHour) {
      displayTime = Math.round((ts - timestamp) / secondsPerMinute) + "m";
    }
    else if ((ts - timestamp) < secondsPerDay) {
      displayTime = Math.round((ts - timestamp) / secondsPerHour) + "h";
    }
    else if ((ts - timestamp) < secondsPerWeek) {
      displayTime = Math.round((ts - timestamp) / secondsPerDay) + "d";
    }
    else {
      displayTime = Math.round((ts - timestamp) / secondsPerWeek) + "w";
    }
    return displayTime;
  }

  public openDeleteStoryDialog(storyID: number){
    let dialogRef = this.dialog.open(StoryDeleteFormComponent, {
      panelClass:"DialogDefaultContainer",
      data: { 
        'storyID': storyID,
      },
    }).afterClosed().subscribe(response => {
      if (response && response['deleted']){
        this.getReportedStories();
      }
    });
  }

  public closeCase(storyID: number){
    this._reportService.closeCase(this.raceID, storyID).then((data) => {
      if(data['success']){
        this.getReportedStories();
      }
    });
  }

}
