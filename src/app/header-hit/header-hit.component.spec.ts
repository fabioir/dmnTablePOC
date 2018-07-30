import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderHitComponent } from './header-hit.component';

describe('HeaderHitComponent', () => {
  let component: HeaderHitComponent;
  let fixture: ComponentFixture<HeaderHitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderHitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderHitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
