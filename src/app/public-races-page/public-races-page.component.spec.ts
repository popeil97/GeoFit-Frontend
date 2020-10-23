import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRacesPageComponent } from './public-races-page.component';

describe('RacesComponent', () => {
  let component: PublicRacesPageComponent;
  let fixture: ComponentFixture<PublicRacesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicRacesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicRacesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
