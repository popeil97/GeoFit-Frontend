import {Component, ViewContainerRef} from '@angular/core';

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