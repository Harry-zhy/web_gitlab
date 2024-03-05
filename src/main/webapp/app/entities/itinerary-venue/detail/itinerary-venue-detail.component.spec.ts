import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItineraryVenueDetailComponent } from './itinerary-venue-detail.component';

describe('ItineraryVenue Management Detail Component', () => {
  let comp: ItineraryVenueDetailComponent;
  let fixture: ComponentFixture<ItineraryVenueDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryVenueDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itineraryVenue: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItineraryVenueDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItineraryVenueDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itineraryVenue on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itineraryVenue).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
