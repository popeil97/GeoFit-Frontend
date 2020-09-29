import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HybridLeaderboardComponent } from './hybrid-leaderboard.component';

describe('HybridLeaderboardComponent', () => {
  let component: HybridLeaderboardComponent;
  let fixture: ComponentFixture<HybridLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HybridLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HybridLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
