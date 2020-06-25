import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryBtnComponent } from './story-btn.component';

describe('StoryBtnComponent', () => {
  let component: StoryBtnComponent;
  let fixture: ComponentFixture<StoryBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
