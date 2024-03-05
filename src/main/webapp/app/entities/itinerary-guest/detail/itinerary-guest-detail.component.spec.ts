import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItineraryGuestDetailComponent } from './itinerary-guest-detail.component';

describe('ItineraryGuest Management Detail Component', () => {
  let comp: ItineraryGuestDetailComponent;
  let fixture: ComponentFixture<ItineraryGuestDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryGuestDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itineraryGuest: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItineraryGuestDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItineraryGuestDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itineraryGuest on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itineraryGuest).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
