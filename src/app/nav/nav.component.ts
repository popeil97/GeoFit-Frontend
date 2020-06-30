import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';
import {Observable} from 'rxjs/Rx';
declare var $: any

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private _notificationService:NotificationsService) { }
  public notifications:any[];

  ngOnInit() {
    // copy pasta from stack overflow yahooooooo
    $(document).on('click', '.dropdown-menu', function (e) {
      e.stopPropagation();
    });
    
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
