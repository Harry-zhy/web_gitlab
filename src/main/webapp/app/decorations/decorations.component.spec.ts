import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecorationsComponent } from './decorations.component';

describe('DecorationsComponent', () => {
  let component: DecorationsComponent;
  let fixture: ComponentFixture<DecorationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DecorationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DecorationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
