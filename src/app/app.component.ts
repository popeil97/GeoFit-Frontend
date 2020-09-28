import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {AuthService} from './auth.service';
import {throwError} from 'rxjs';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public viewRef: ViewContainerRef) { }

  
}