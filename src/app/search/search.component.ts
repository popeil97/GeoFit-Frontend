import { Component, OnInit, Input } from '@angular/core';
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

}
