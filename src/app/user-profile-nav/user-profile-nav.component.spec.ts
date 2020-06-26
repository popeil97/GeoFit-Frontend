import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileNavComponent } from './user-profile-nav.component';

describe('UserProfileNavComponent', () => {
  let component: UserProfileNavComponent;
  let fixture: ComponentFixture<UserProfileNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
