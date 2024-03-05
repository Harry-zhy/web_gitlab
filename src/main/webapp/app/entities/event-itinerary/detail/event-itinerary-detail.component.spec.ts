import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventItineraryDetailComponent } from './event-itinerary-detail.component';

describe('EventItinerary Management Detail Component', () => {
  let comp: EventItineraryDetailComponent;
  let fixture: ComponentFixture<EventItineraryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventItineraryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eventItinerary: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventItineraryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventItineraryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eventItinerary on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eventItinerary).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
