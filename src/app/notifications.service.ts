import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http:HttpClient) { }

  createNotification(form:any) {
    return this.http.post('http://localhost:8000/api/notification-create/',{form:form}).toPromise();
  }

  // will poll for notifications, this is very bad, don't keep this for too long
  getNotifications() {
    return this.http.get('http://localhost:8000/api/notification-get/')
  }
}

export enum NotificationType {
  GENERAL=1,
  TEAM_JOIN=2,
  FOLLOW_REQUEST=3,
}
