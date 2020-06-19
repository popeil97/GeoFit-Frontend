import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-activities-menu',
  templateUrl: './activities-menu.component.html',
  styleUrls: ['./activities-menu.component.css']
})
export class ActivitiesMenuComponent implements OnInit {

  @Input() activities:Activity[] = [];
  @Output() addAct: EventEmitter<any> = new EventEmitter();
  @Output() importActs: EventEmitter<void> = new EventEmitter();
  private columns:string[] = ['Name','Distance','Date'];


  constructor() { }

  ngOnInit() {

    // this.addAct.emit({id:2} as any);

  }

  add(act:Activity): void {
    this.addAct.emit(act);
  }

  importSelectedActs(): void {
    this.importActs.emit();
  }

}

export interface Activity {
  name:string,
  converted_dist:number,
  start_date:string
}
