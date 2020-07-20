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
  aboutData:AboutData = {owner:{}} as AboutData;
  raceSettings:RaceSettings = {} as RaceSettings;
  showForm: Boolean;
  raceName:string;
  raceID:number;
  uploadeUrl:any;
  teamSizeOptions = [2,3,4,5,6,7,8,9,10];
  isOwner: Boolean;

  constructor(private raceService:RaceService,private route: ActivatedRoute,private router:Router) { }

  ngOnInit() {

    this.showForm = false;

    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });

    this.raceService.getRaceAbout(this.raceID).then((resp) => {
      console.log('RESP FROM SERVER:',resp);
      resp = resp as any;
      this.aboutData = resp['about_info'] as AboutData;
      this.raceSettings = resp['race_settings'];
      this.isOwner = resp['isOwner'];

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
      raceImage: new FormControl(''),
      rules: new FormGroup({
        isManual: new FormControl(this.raceSettings.isManualEntry),
        allowTeams: new FormControl(this.raceSettings.allowTeams),
        maxTeamSize: new FormControl(this.raceSettings.max_team_size,[
          Validators.max(10)
        ])
      })
    });

  }

  viewRace() {
    // set race in race service

    this.router.navigate(['/race',{name:this.raceName,id:this.raceID}]);
  }

  joinRace() {
    let race_id = this.raceID
    this.raceService.joinRace(race_id).then((res) => {
      console.log('RES FROM JOIN:',res);
      this.router.navigate(['/race',{name:this.raceName,id:race_id}]);
    });
  }

  update(): void {
    let formClean = this.AboutForm.value as any;
    console.log(this.AboutForm);
    let isValid: Boolean = this.AboutForm.valid;

    formClean.raceImage = this.uploadeUrl;
    formClean.rules.race_id = this.raceSettings.race_id;
    console.log('IS VALID:',formClean);

    

    if(isValid) {
      this.raceService.updateRaceAbout(formClean,this.raceID).then((resp) => {
        this.aboutData = resp['about_info'] as AboutData;
        this.raceSettings = resp['race_settings'] as RaceSettings;
        this.initializeForm();
        this.toggleForm();
      });
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadeUrl = reader.result;
      }
    }
  }

}

export interface AboutData {
  name:string;
  description:string;
  owner:any;
  race_image:string;
}

interface Event {
  target:any
}

export interface RaceSettings {
  isManualEntry:Boolean;
  allowTeams:Boolean;
  race_id:number;
  max_team_size:number;
}
