import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proxy2',
  templateUrl: './proxy2.component.html',
  styleUrls: ['./proxy2.component.css']
})
export class Proxy2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.replace('https://tucan.fitness/about;name=Run%20for%20the%20Dogs;id=20');
  }

}
