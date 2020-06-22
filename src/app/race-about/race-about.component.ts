import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { RaceService } from '../race.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-race-about',
  templateUrl: './race-about.component.html',
  styleUrls: ['./race-about.component.css']
})
export class RaceAboutComponent implements OnInit {

  public AboutForm: FormGroup;
  private aboutData:AboutData = {owner:{}} as AboutData;
  private showForm: Boolean;
  private raceName:string;
  private raceID:number;

  constructor(private raceService:RaceService,private route: ActivatedRoute,private router:Router) { }

  ngOnInit() {

    this.showForm = false;

    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });

    this.AboutForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      description: new FormControl('',[
        Validators.required
      ]),
      picture: new FormControl('')
    });

    this.raceService.getRaceAbout(1).then((resp) => {
      console.log('RESP FROM SERVER:',resp);
      resp = resp as any;
      this.aboutData = resp.about_info as AboutData;

      this.initializeForm();
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  initializeForm(): void {
    this.AboutForm = new FormGroup({
      name: new FormControl(this.aboutData.name,[
        Validators.required,
        Validators.maxLength(30)
      ]),
      description: new FormControl(this.aboutData.description,[
        Validators.required
      ]),
      picture: new FormControl('')
    });

  }

  viewRace(race:any) {
    console.log('SELECTED RACE:',race);

    // set race in race service

    this.router.navigate(['/race',{name:this.raceName,id:this.raceID}]);
  }

  update(): void {
    let formClean = this.AboutForm.value as any;
    console.log(this.AboutForm);
    let isValid: Boolean = this.AboutForm.valid;

    console.log('IS VALID:',isValid);

    if(isValid) {
      this.raceService.updateRaceAbout(formClean,this.raceID).then((resp) => {
        this.aboutData = resp.about_info as AboutData;
        this.initializeForm();
        this.toggleForm();
      });
    }
  }

}

export interface AboutData {
  name:string;
  description:string;
  owner:any;
}
