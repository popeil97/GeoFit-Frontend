import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePinDialogComponent } from './route-pin-dialog.component';

describe('RoutePinDialogComponent', () => {
  let component: RoutePinDialogComponent;
  let fixture: ComponentFixture<RoutePinDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePinDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
