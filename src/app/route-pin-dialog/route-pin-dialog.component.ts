import { Component, OnInit, Inject,Input} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { ModalService } from '../modalServices';
@Component({
  selector: 'app-route-pin-dialog',
  templateUrl: './route-pin-dialog.component.html',
  styleUrls: ['./route-pin-dialog.component.css']
})
export class RoutePinDialogComponent implements OnInit {
  @Input() id: string;
  title: string;
  description: string;
  image_urls: string;
  carouselOptions:any;

  constructor(private modalService: ModalService) { }

  ngOnInit() {

    this.carouselOptions = {
                    items: 1,
                    center: true,
                    nav: true,
                    navText: ["<div style=\"font-size:30px\"><<div>", "<div style=\"font-size:30px\">><div>"],
                  }

  }

  closeModal(id: string) {
    this.modalService.close(id);
    console.log(this.modalService.getModalData(id));
  }
  get d() { return this.modalService.modalsData[this.id]}

}
