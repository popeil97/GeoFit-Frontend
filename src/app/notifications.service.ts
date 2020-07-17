import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotifactionAction } from './notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http:HttpClient) { }

  createNotification(form:any) {
    return this.http.post('/api/notification-create/',{form:form}).toPromise();
  }

  // will poll for notifications, this is very bad, don't keep this for too long
  getNotifications() {
    return this.http.get('/api/notification-get/');
  }

  submitAction(not_id:number,action:NotifactionAction) {
    return this.http.post('/api/notification-action/',{not_id:not_id,action:action}).toPromise();
  }
}

export enum NotificationType {
  GENERAL=1,
  TEAM_JOIN=2,
  TEAM_JOIN_SUCCESS=3,
  FOLLOW_REQUEST=4,
}
