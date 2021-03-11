import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceMapuploadComponent } from './race-mapupload.component';

describe('RaceMapuploadComponent', () => {
  let component: RaceMapuploadComponent;
  let fixture: ComponentFixture<RaceMapuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceMapuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceMapuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
