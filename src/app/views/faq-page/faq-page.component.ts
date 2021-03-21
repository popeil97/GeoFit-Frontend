import { Component } from '@angular/core';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: [
    './faq-page.component.css',
    '../../../styles/dropdown.css'
  ]
})
export class FaqPageComponent {

  private questionsOpen = [];

  constructor() { }

  ToggleQuestion = (key:string = null) => {
    if (key == null) return;
    const keyIndex = this.questionsOpen.indexOf(key);
    if (keyIndex == -1) this.questionsOpen.push(key);
    else delete this.questionsOpen[keyIndex];
    return;
  }

  IsOpen = (key:string = null) => {
    if (key == null) return;
    return this.questionsOpen.indexOf(key) > -1;
  }

}
