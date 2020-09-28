import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryFormStandaloneComponent } from './story-form-standalone.component';

describe('StoryFormStandaloneComponent', () => {
  let component: StoryFormStandaloneComponent;
  let fixture: ComponentFixture<StoryFormStandaloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryFormStandaloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryFormStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
