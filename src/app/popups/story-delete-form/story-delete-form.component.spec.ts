import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDeleteFormComponent } from './story-delete-form.component';

describe('StoryDeleteFormComponent', () => {
  let component: StoryDeleteFormComponent;
  let fixture: ComponentFixture<StoryDeleteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryDeleteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDeleteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
