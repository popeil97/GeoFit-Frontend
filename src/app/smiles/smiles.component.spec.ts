import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmilesComponent } from './smiles.component';

describe('SmilesComponent', () => {
  let component: SmilesComponent;
  let fixture: ComponentFixture<SmilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
