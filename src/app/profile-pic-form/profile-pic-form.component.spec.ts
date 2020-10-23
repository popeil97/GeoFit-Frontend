import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePicFormComponent } from './profile-pic-form.component';

describe('ProfilePicFormComponent', () => {
  let component: ProfilePicFormComponent;
  let fixture: ComponentFixture<ProfilePicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePicFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
