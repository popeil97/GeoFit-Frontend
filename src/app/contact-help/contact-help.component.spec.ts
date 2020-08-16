import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactHelpComponent } from './contact-help.component';

describe('ContactHelpComponent', () => {
  let component: ContactHelpComponent;
  let fixture: ComponentFixture<ContactHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
