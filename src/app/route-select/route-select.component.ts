import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { 
  LeaderboardService 
} from '../services';
import { ChildRaceData } from '../race-view-page/race-view-page.component';

@Component({
  selector: 'app-route-select',
  templateUrl: './route-select.component.html',
  styleUrls: ['./route-select.component.css']
})
export class RouteSelectComponent implements OnInit {

  @Input() routes:ChildRaceData[] = [];
  @Input() title:string;
  @Output() routeChanged: EventEmitter<any> = new EventEmitter();

  public selectedRoute:ChildRaceData;

  constructor() { }

  // ngOnChanges(changes: SimpleChanges) {
  //   for(const propName in changes) {
  //     if(changes.hasOwnProperty(propName)) {
  //       switch(propName) {
  //         case 'routes':
  //           if (this.routes == null){
  //             this.getMapData();
  //           }
  //       }
  //     }
  //   }
  // }

  ngOnInit() {
  }

  onRouteSelect(route:ChildRaceData) {
  //   console.log(route)
    this.selectedRoute = route;
    this.routeChanged.emit(this.selectedRoute);
  }

}