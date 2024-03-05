import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItineraryDateTimeDetailComponent } from './itinerary-date-time-detail.component';

describe('ItineraryDateTime Management Detail Component', () => {
  let comp: ItineraryDateTimeDetailComponent;
  let fixture: ComponentFixture<ItineraryDateTimeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryDateTimeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itineraryDateTime: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItineraryDateTimeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItineraryDateTimeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itineraryDateTime on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itineraryDateTime).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
