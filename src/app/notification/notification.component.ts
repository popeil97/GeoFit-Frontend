import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationType, NotificationsService } from '../notifications.service';
import { TeamService } from '../team.service';
import {MatSnackBar} from '@angular/material/snack-bar'
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() notification:Notification;
  @Output() removeNotification: EventEmitter<any> = new EventEmitter();
  

  constructor(private _notificationService:NotificationsService,private _snackbar:MatSnackBar) { }

  ngOnInit() {


}

  approve() {
    // general approval action, backend will sort out what the notifcation is for
    this._notificationService.submitAction(this.notification.not_id,NotifactionAction.APPROVE).then((resp) => {
      console.log('APPROVE RESP: ',resp);
      this._snackbar.openFromComponent(SnackbarComponent,{duration: 5000,horizontalPosition: 'left',
      verticalPosition: 'bottom',data:{message:'Action has been approved!'}});
      this.removeNotification.emit(this.notification.not_id);
    });
  }

  decline() {
    this._notificationService.submitAction(this.notification.not_id,NotifactionAction.DECLINE).then((resp) => {
      console.log('APPROVE RESP: ',resp);
      this._snackbar.openFromComponent(SnackbarComponent,{duration: 5000,horizontalPosition: 'center',
      verticalPosition: 'bottom',data:{message:'Action has been declined'}});
      this.removeNotification.emit(this.notification.not_id);
    });  
  }

  hide() {
    this._notificationService.submitAction(this.notification.not_id,NotifactionAction.HIDE).then((resp) => {
      console.log('HIDE RESP: ',resp);
    });
    this.removeNotification.emit(this.notification.not_id);
  }

  showButton(name:string,type:NotificationType): Boolean {
    if(name=='Accept' && (type == NotificationType.TEAM_JOIN || type == NotificationType.FOLLOW_REQUEST)) {
      return true;
    }

    else if(name=='Decline' && (type == NotificationType.TEAM_JOIN || type == NotificationType.FOLLOW_REQUEST)) {
      return true;
    }

    else if(name == 'Hide' && (type != NotificationType.TEAM_JOIN && type != NotificationType.FOLLOW_REQUEST)) {
      return true;
    }

    else if (name=='View' && (type == NotificationType.COMMENT)) {
      return true;
    }
  }
}



interface Notification {
  message:string;
  from:any;
  type:NotificationType;
  not_id:number;
}

export enum NotifactionAction {
  APPROVE=1,
  DECLINE=2,
  HIDE=3,
}