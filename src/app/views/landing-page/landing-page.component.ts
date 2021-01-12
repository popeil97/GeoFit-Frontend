import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {throwError} from 'rxjs';
import $ from "jquery";

import { ModalService } from '../../modalServices';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  private testString = "From Parent";

  constructor(public _authService: AuthService, private modalService: ModalService) { }

  ngOnInit() {
    //If we already store a JWT locally, set it in memory
    if (localStorage.getItem('access_token')){
      this._authService.token = localStorage.getItem('access_token');
    }

  }

  logout() {
    this._authService.logout();
  }

  openModal(id: string) {
    var data = (id == 'custom-modal-3') ? {race_id:'HELLO',callbackFunction:null} : {};
    data.callbackFunction = this.testFunction;
    this.modalService.open(id,data);
  }

  testFunction = (incomingData = null) => {
    const toAlert = (incomingData != null) ? incomingData : this.testString;
    console.log(toAlert);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

/**
* Template Name: Mamba - v2.3.0
* Template URL: https://bootstrapmade.com/mamba-one-page-bootstrap-template-free/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/


}



