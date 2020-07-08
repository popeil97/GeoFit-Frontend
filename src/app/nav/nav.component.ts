import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';
// import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
// import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private _notificationService:NotificationsService) { }
  public notifications:any[];

  ngOnInit() {
    Observable.interval(5000) // make much larger in production
    .switchMap(() => this._notificationService.getNotifications())
    .subscribe((resp:NotificationResp) => {
      console.log(resp);
      this.notifications = resp.notifications;
    });
  }


}

interface NotificationResp {
  notifications:any[];
}
