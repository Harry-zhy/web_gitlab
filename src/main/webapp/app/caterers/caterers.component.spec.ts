import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaterersComponent } from './caterers.component';

describe('CaterersComponent', () => {
  let component: CaterersComponent;
  let fixture: ComponentFixture<CaterersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaterersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaterersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
