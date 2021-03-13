import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceMapSettingsComponent } from './race-map-settings.component';

describe('RaceMapuploadComponent', () => {
  let component: RaceMapSettingsComponent;
  let fixture: ComponentFixture<RaceMapSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceMapSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceMapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
