import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { openStdin } from 'process';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }

  submitOrder(order:Order) {
    return this.http.post(environment.apiUrl + '/orders/submit/', {order:order}).toPromise();
  }
}

export interface Order {
  payment_id:number;
  details:string;
  race_id:number;
  shipping_id:number;
}
