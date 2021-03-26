import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import {
  Payment,
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }

  confirmPayment(payment:Payment) {
    return this.http.post(environment.apiUrl + '/payments/confirmed/',{payment:payment}).toPromise();
  }

  getOrderID(price:string) {
    return this.http.post(environment.apiUrl + '/payments/order/',{price:price}).toPromise();
  }

  captureOrder(race_id:number,payment_id:string) {
    return this.http.post(environment.apiUrl + '/payments/capture/',{race_id:race_id,payment_id:payment_id}).toPromise();
  }
}