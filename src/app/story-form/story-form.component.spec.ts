import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryFormComponent } from './story-form.component';

describe('StoryFormComponent', () => {
  let component: StoryFormComponent;
  let fixture: ComponentFixture<StoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
