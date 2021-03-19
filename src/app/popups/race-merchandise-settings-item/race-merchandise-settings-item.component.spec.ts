import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceMerchandiseSettingsItemComponent } from './race-merchandise-settings-item.component';

describe('RaceMerchandiseSettingsItemComponent', () => {
  let component: RaceMerchandiseSettingsItemComponent;
  let fixture: ComponentFixture<RaceMerchandiseSettingsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceMerchandiseSettingsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceMerchandiseSettingsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
