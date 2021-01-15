import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';

import { ModalService } from '../../modalServices';

@Component({
  selector: 'app-for-race-creators',
  templateUrl: './for-race-creators.component.html',
  styleUrls: ['./for-race-creators.component.css']
})
export class ForRaceCreatorsComponent implements OnInit {

  constructor(public _authService: AuthService, private modalService: ModalService) { }

  ngOnInit() {
    //If we already store a JWT locally, set it in memory
    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }
  }

  testFunction = (incomingData = null) => {
    const toAlert = (incomingData != null) ? incomingData : "TEST FUNCTION";
    console.log(toAlert);
  }

  logout() {
    this._authService.logout();
  }

  openModal(id: string) {
    var data = (id == 'custom-modal-3') ? {race_id:'HELLO',callbackFunction:null} : {};
    data.callbackFunction = this.testFunction;
    this.modalService.open(id,data);
  }

  closeModal(id: string) {
    this.modalService.close(id);
}

}
