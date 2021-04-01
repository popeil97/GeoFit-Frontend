import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveStateExplanationPopupComponent } from './inactive-state-explanation-popup.component';

describe('InactiveStateExplanationPopupComponent', () => {
  let component: InactiveStateExplanationPopupComponent;
  let fixture: ComponentFixture<InactiveStateExplanationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveStateExplanationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveStateExplanationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
