import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceFeedComponent } from './race-feed.component';

describe('RaceFeedComponent', () => {
  let component: RaceFeedComponent;
  let fixture: ComponentFixture<RaceFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
