import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { CoordinatesService } from '../coordinates.service';

@Component({
  selector: 'app-race-create',
  templateUrl: './race-create.component.html',
  styleUrls: ['./race-create.component.css']
})
export class RaceCreateComponent implements OnInit {

  raceForm:FormGroup;
  options:any[];
  coords:any;

  constructor(private coordinateService:CoordinatesService) { 
    this.raceForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      startDate: new FormControl('',[
        Validators.required
      ]),
      endDate: new FormControl('',[
        Validators.required
      ]),
      startLoc: new FormControl('',[
        Validators.required
      ]),
      endLoc: new FormControl('', [
        Validators.required
      ]),
      public: new FormControl(false,[
        Validators.required
      ]),
      routeFile: new FormControl('')
    });

    this.options = [
      {
        name: 'Ocala, FL'
      },
      {
        name: 'Gainesville, FL'
      }
    ];

    this.coords = coordinateService.getCoordinates({},{});
  }

  ngOnInit() {
  }

  preview() {
    console.log(this.raceForm);
  }

  locationFilter(event) {
    console.log(event);
  }

}
