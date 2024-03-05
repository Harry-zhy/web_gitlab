import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedactivitypageComponent } from './bookedactivitypage.component';

describe('BookedactivitypageComponent', () => {
  let component: BookedactivitypageComponent;
  let fixture: ComponentFixture<BookedactivitypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookedactivitypageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookedactivitypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
