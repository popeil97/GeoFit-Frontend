import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../modalServices';

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.css']
})
export class RouteInfoComponent implements OnInit {

  @Input() id: string;
  modalData: any;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

   get d() { return this.modalService.modalsData[this.id]}

  closeDialog() {
    if (this.id == null) return;
    this.modalService.close(this.id);
  }

}
