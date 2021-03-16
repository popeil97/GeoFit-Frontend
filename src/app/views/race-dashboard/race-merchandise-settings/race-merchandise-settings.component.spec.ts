import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceMerchandiseSettingsComponent } from './race-merchandise-settings.component';

describe('RaceMerchandiseSettingsComponent', () => {
  let component: RaceMerchandiseSettingsComponent;
  let fixture: ComponentFixture<RaceMerchandiseSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceMerchandiseSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceMerchandiseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
