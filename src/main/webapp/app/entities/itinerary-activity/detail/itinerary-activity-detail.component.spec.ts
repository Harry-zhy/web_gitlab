import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItineraryActivityDetailComponent } from './itinerary-activity-detail.component';

describe('ItineraryActivity Management Detail Component', () => {
  let comp: ItineraryActivityDetailComponent;
  let fixture: ComponentFixture<ItineraryActivityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryActivityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itineraryActivity: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItineraryActivityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItineraryActivityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itineraryActivity on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itineraryActivity).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
