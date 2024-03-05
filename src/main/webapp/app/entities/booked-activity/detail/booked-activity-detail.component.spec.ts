import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BookedActivityDetailComponent } from './booked-activity-detail.component';

describe('BookedActivity Management Detail Component', () => {
  let comp: BookedActivityDetailComponent;
  let fixture: ComponentFixture<BookedActivityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookedActivityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bookedActivity: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BookedActivityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BookedActivityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bookedActivity on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bookedActivity).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
