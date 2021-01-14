import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointItemComponent } from './checkpoint-item.component';

describe('CheckpointItemComponent', () => {
  let component: CheckpointItemComponent;
  let fixture: ComponentFixture<CheckpointItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckpointItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckpointItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
