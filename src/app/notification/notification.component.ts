import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar'
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { 
  TeamService,
  NotificationsService,
  StoryService,
} from '../services';
import {
  NotificationType,
} from '../interfaces';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() notification:Notification;
  @Output() removeNotification: EventEmitter<any> = new EventEmitter();
  
  constructor(
    private _notificationService:NotificationsService,
    private _snackbar:MatSnackBar,
    public dialog: MatDialog,
    private _storyService:StoryService
  ) {}

  ngOnInit() {}

  approve() {
    // general approval action, backend will sort out what the notifcation is for
    this._notificationService.submitAction(this.notification.not_id,NotifactionAction.APPROVE).then((resp) => {
    //  console.log('APPROVE RESP: ',resp);
      this._snackbar.openFromComponent(SnackbarComponent,{duration: 5000,horizontalPosition: 'left',
      verticalPosition: 'bottom',data:{message:'Action has been approved!'}});
      this.removeNotification.emit(this.notification.not_id);
    });
  }

  decline() {
    this._notificationService.submitAction(this.notification.not_id,NotifactionAction.DECLINE).then((resp) => {
  //    console.log('APPROVE RESP: ',resp);
      this._snackbar.openFromComponent(SnackbarComponent,{duration: 5000,horizontalPosition: 'center',
      verticalPosition: 'bottom',data:{message:'Action has been declined'}});
      this.removeNotification.emit(this.notification.not_id);
    });  
  }

  hide() {
    this._notificationService.submitAction(this.notification.not_id,NotifactionAction.HIDE).then((resp) => {
     //  console.log('HIDE RESP: ',resp);
    });
    this.removeNotification.emit(this.notification.not_id);
  }

  showButton(name:string,type:NotificationType): Boolean {
    var returnValue = false;
    switch(name) {
      case('Accept'):
        returnValue = (type == NotificationType.TEAM_JOIN || type == NotificationType.FOLLOW_REQUEST);
        break;
      case('Decline'):
        returnValue = (type == NotificationType.TEAM_JOIN || type == NotificationType.FOLLOW_REQUEST);
        break;
      case('Hide'):
        returnValue = (type != NotificationType.TEAM_JOIN && type != NotificationType.FOLLOW_REQUEST);
        break;
      case('View'):
        returnValue = (type == NotificationType.COMMENT);
        break;
    }
    return returnValue;
  }

  viewStory(storyID:number): void {
    // need to get story from API, then display in dialog
    let storyData = null;
    this._storyService.getStoryModalData(this.notification.context_id).then((storyData) => {
     //  console.log("In dialogue function");
      let dialogRef = this.dialog.open(StoryDialogComponent, {
        data: { 
          'element': storyData,
          'showComments':true,
        },
      });
    })
    
  }


}



interface Notification {
  message:string;
  from:any;
  type:NotificationType;
  not_id:number;
  context_id:number;
}

export enum NotifactionAction {
  APPROVE=1,
  DECLINE=2,
  HIDE=3,
}