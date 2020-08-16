import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-route-pin-dialog',
  templateUrl: './route-pin-dialog.component.html',
  styleUrls: ['./route-pin-dialog.component.css']
})
export class RoutePinDialogComponent implements OnInit {
  title: string;
  description: string;
  image_urls: string;
  carouselOptions:any;

  constructor(public dialogRef: MatDialogRef<RoutePinDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { 
                  this.title = data.title;
                  this.description = data.description;
                  this.image_urls = data.image_urls;
                  
                  this.carouselOptions = {
                    items: 1,
                    center: true,
                    nav: true,
                    navText: ["<div style=\"font-size:30px\"><<div>", "<div style=\"font-size:30px\">><div>"],
                  }
                }

  ngOnInit() {
  }

}
