import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqHelpComponent } from './faq-help.component';

describe('FaqHelpComponent', () => {
  let component: FaqHelpComponent;
  let fixture: ComponentFixture<FaqHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
