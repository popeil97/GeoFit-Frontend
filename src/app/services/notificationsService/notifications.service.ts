import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotifactionAction } from '../../notification/notification.component';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http:HttpClient) { }

  createNotification(form:any) {
    try {
      return this.http.post(environment.apiUrl + '/notifications/create/',{form:form}).toPromise();
    }
    catch(err) {
        console.log("couldn't create notification.")
    }
    
  }

  // will poll for notifications, this is very bad, don't keep this for too long
  getNotifications() {
    try {
      return this.http.get(environment.apiUrl + '/notifications/');
    }
    catch(err) {
        console.log("couldn't get notifications.")
    }

    
  }

  submitAction(not_id:number,action:NotifactionAction) {
    try {
      return this.http.post(environment.apiUrl + '/notifications/action/',{not_id:not_id,action:action}).toPromise();
    }
    catch(err) {
        console.log("couldn't take action for notifications.")
    }

    
  }
}