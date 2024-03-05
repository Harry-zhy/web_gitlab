import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfactivitypageComponent } from './selfactivitypage.component';

describe('SelfactivitypageComponent', () => {
  let component: SelfactivitypageComponent;
  let fixture: ComponentFixture<SelfactivitypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfactivitypageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfactivitypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
