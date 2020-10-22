import { Component, OnInit,Input } from '@angular/core';
import { ModalService } from '../modalServices';
import { AuthService } from '../auth.service';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-story-popup',
  templateUrl: './story-popup.component.html',
  styleUrls: ['./story-popup.component.css']
})
export class StoryPopupComponent implements OnInit {

  @Input() id: string;

  constructor(private modalService: ModalService,private _storyService: StoryService,
              private _authService: AuthService) { }

  ngOnInit() {
  }

   get d() { return this.modalService.modalsData[this.id]}

  closeDialog() {
    if (this.id == null) return;
    this.modalService.close(this.id);
  }


}
