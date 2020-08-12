import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-route-pin-dialog',
  templateUrl: './route-pin-dialog.component.html',
  styleUrls: ['./route-pin-dialog.component.css']
})
export class RoutePinDialogComponent implements OnInit {
  private description: string;
  private image_urls: string;
  private carouselOptions:any;

  constructor(public dialogRef: MatDialogRef<RoutePinDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { 
                  this.description = data.description;
                  this.image_urls = data.image_urls;
                  
                  this.carouselOptions = {
                    items: 1,
                    center: true,
                    nav: true,
                  }
                }

  ngOnInit() {
  }

}
