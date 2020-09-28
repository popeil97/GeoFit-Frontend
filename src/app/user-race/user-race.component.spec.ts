import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRaceComponent } from './user-race.component';

describe('UserRaceComponent', () => {
  let component: UserRaceComponent;
  let fixture: ComponentFixture<UserRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
