import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Input() userData: any;
  @Input() isTag: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  followStatusChanged() {
    this.userData.follows = !this.userData.follows;
  }

}
