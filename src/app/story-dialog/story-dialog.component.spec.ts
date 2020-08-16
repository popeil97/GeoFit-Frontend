import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDialogComponent } from './story-dialog.component';

describe('StoryDialogComponent', () => {
  let component: StoryDialogComponent;
  let fixture: ComponentFixture<StoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
