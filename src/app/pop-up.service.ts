import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  makePopup(data: any): string {
    return '' +
      '<div>Capital:' + data.name  + '</div>' +
      '<div>State:' + data.state + '</div>';
  }
}
