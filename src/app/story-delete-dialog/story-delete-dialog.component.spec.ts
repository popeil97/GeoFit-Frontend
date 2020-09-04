import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDeleteDialogComponent } from './story-delete-dialog.component';

describe('StoryDeleteDialogComponent', () => {
  let component: StoryDeleteDialogComponent;
  let fixture: ComponentFixture<StoryDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
