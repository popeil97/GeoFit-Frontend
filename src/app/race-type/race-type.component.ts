import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../modalServices';

@Component({
  selector: 'app-race-type',
  templateUrl: './race-type.component.html',
  styleUrls: ['./race-type.component.css']
})
export class RaceTypeComponent implements OnInit {

  @Input() id: string;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  closeDialog() {
    if (this.id == null) return;
    this.modalService.close(this.id);
  }

}
