import { Component, OnInit, Input } from '@angular/core';
import {
  Progress
} from '../../interfaces';

@Component({
  selector: 'app-user-progress',
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.css']
})


export class UserProgressComponent implements OnInit {

  @Input() progress:Progress;

  constructor() { }

  ngOnInit() {
    if(this.progress == undefined) {
      this.progress = {} as Progress;
    }
  }

}


