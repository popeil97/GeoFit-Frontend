import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {AuthService} from './auth.service';
import {throwError} from 'rxjs';

import { ModalService } from './modalServices';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public viewRef: ViewContainerRef,
    public modalService: ModalService,
  ) {}
}