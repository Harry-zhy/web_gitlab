import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BookedCatererDetailComponent } from './booked-caterer-detail.component';

describe('BookedCaterer Management Detail Component', () => {
  let comp: BookedCatererDetailComponent;
  let fixture: ComponentFixture<BookedCatererDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookedCatererDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bookedCaterer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BookedCatererDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BookedCatererDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bookedCaterer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bookedCaterer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
