import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInformationItemGroupComponent } from './header-information-item-group.component';

describe('HeaderInformationItemGroupComponent', () => {
  let component: HeaderInformationItemGroupComponent;
  let fixture: ComponentFixture<HeaderInformationItemGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderInformationItemGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderInformationItemGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
