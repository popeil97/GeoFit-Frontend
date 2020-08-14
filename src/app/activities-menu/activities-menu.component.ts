import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-activities-menu',
  templateUrl: './activities-menu.component.html',
  styleUrls: ['./activities-menu.component.css']
})
export class ActivitiesMenuComponent implements OnInit {

  @Input() activities:Activity[] = [];
  @Input() distance_unit:string;
  @Output() addAct: EventEmitter<any> = new EventEmitter();
  @Output() importActs: EventEmitter<void> = new EventEmitter();
  columns:string[] = ['Name','Distance'];
  selectedRows:number[] = [];


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

  highlight(row:any): void {
    let index = this.selectedRows.indexOf(row.id);
    if(index >= 0) {
      this.selectedRows.splice(index,1);
    }
    else {
      this.selectedRows.push(row.id);
    }

    console.log(this.selectedRows);
  }

}

export interface Activity {
  name:string,
  converted_dist:number,
  start_date:string
}
