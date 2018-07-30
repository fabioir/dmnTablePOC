import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOutputsGroupComponent } from './header-outputs-group.component';

describe('HeaderOutputsGroupComponent', () => {
  let component: HeaderOutputsGroupComponent;
  let fixture: ComponentFixture<HeaderOutputsGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderOutputsGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderOutputsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
