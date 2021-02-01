import { Component, Input, OnInit } from '@angular/core';
import { CheckpointService } from '../checkpoint.service';

@Component({
  selector: 'app-checkpoint-item',
  templateUrl: './checkpoint-item.component.html',
  styleUrls: ['./checkpoint-item.component.css']
})
export class CheckpointItemComponent implements OnInit {

  @Input() checkpointID:number;
  checkpoint: Checkpoint = {content:{}} as Checkpoint;

  constructor(private _checkpointService:CheckpointService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    console.log('GOT A CHECKPOIHT ID:',this.checkpointID);
    // get checkpoint data
    this.getCheckpointContent();
  }

  getCheckpointContent() {
    this._checkpointService.getCheckpointContentByID(this.checkpointID).then((res) => {
      this.checkpoint = res['checkpoint_data'];
      console.log('CHECKPOINT DATA:',this.checkpoint);
    });
  }

}

export interface CheckpointContent {
  image:any;
  description: string;
}

export interface Checkpoint {
  marker: number;
  name: string;
  id: number;
  content: CheckpointContent;
}
