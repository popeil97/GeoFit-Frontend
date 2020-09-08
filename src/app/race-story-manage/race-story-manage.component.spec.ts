import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceStoryManageComponent } from './race-story-manage.component';

describe('RaceStoryManageComponent', () => {
  let component: RaceStoryManageComponent;
  let fixture: ComponentFixture<RaceStoryManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceStoryManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceStoryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
