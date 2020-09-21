import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';

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
    return this.http.post(environment.apiUrl + '/api/payment-confirmed/',{payment:payment}).toPromise();
  }

  getOrderID(price:string) {
    return this.http.post(environment.apiUrl + '/api/create-order/',{price:price}).toPromise();
  }

  captureOrder(race_id:number,payment_id:string) {
    return this.http.post(environment.apiUrl + '/api/capture-order/',{race_id:race_id,payment_id:payment_id}).toPromise();
  }
}

export interface Payment {
  paid:number;
  currency:string;
  race_id:number;
  payment_id:string,
  status:string;
  payment_type:PaymentType;
}

export enum PaymentType {
  ENTRY=1,
  SWAG=2,
  DONATION=3,
}