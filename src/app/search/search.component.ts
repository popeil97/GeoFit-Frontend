import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { 
  SearchService,
  RouterService,
} from '../services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.css',
    '../../styles/forms.css'
  ]
})
export class SearchComponent {

  query:string;
  searchResults: any[];
  @Input() raceID: number;
  @Input() userClickEvent:any;

  constructor(
    private _searchService:SearchService,
    private routerService:RouterService,
  ) {}

  filter = ():void => {
    this._searchService.searchForRacer(this.query,this.raceID).then((resp) => {
      console.log('RESP FROM SEARCH:',resp);
      this.searchResults = resp['results'];
    })
  }

  navigateToUserProfile = (e:any, user_data:any):void => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    this.routerService.navigateTo('/profile',{username:user_data.username});
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
