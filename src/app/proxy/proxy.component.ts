import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.css']
})
export class ProxyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.replace('https://tucan.fitness/about;name=A%20Run%20Around%20The%20Sun%20-%20ElderCare%20of%20Alachua%20County;id=19');
  }

}
