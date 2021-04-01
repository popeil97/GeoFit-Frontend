import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRacesComponent } from './public-races.component';

describe('RacesComponent', () => {
  let component: PublicRacesComponent;
  let fixture: ComponentFixture<PublicRacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicRacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicRacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
