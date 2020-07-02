import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {

  constructor(private _usersService:UsersService) { }

  ngOnInit() {
  this._usersService.getUserStats(1,3).then((res)=>{
    console.log(res)
    })
  }

}
