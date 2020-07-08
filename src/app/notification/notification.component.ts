import { Component, OnInit, Input } from '@angular/core';
import { NotificationType } from '../notifications.service';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() notification:Notification;
  

  constructor(private _teamService:TeamService) { }

  ngOnInit() {
    
  }

}

interface Notification {
  message:string;
  from:any;
  type:NotificationType;
}
