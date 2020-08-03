import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-smiles',
  templateUrl: './smiles.component.html',
  styleUrls: ['./smiles.component.css']
})
export class SmilesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.replace('https://dev.tucan.fitness');
  }

}
