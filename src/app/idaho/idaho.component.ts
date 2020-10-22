import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-idaho',
  templateUrl: './idaho.component.html',
  styleUrls: ['./idaho.component.css']
})
export class IdahoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.replace('https://tucan.fitness/about;name=Idaho%20100k;id=1');
  }

}
