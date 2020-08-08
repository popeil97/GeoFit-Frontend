import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInstructionsComponent } from './manual-instructions.component';

describe('ManualInstructionsComponent', () => {
  let component: ManualInstructionsComponent;
  let fixture: ComponentFixture<ManualInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
