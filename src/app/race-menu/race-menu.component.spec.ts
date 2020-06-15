import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceMenuComponent } from './race-menu.component';

describe('RaceMenuComponent', () => {
  let component: RaceMenuComponent;
  let fixture: ComponentFixture<RaceMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
