import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { 
  SearchService
} from '../services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query:string;
  searchResults: any[];
  @Input() raceID: number;
  @Input() userClickEvent:any;

  constructor(
    private _searchService:SearchService
  ) {}

  ngOnInit() {
  }

  filter() {
    this._searchService.searchForRacer(this.query,this.raceID).then((resp) => {
      console.log('RESP FROM SEARCH:',resp);
      this.searchResults = resp['results'];
    })
  }

  userProfileClicked = (e:any, user_data:any):void => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    console.log("USER PROFILE CLICKED IN SEARCH",user_data);
    if (user_data.user_id != null) {
      this.userClickEvent(user_data.user_id);
    }
  }

}
