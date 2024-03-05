import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItineraryDetailComponent } from './itinerary-detail.component';

describe('Itinerary Management Detail Component', () => {
  let comp: ItineraryDetailComponent;
  let fixture: ComponentFixture<ItineraryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itinerary: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItineraryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItineraryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itinerary on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itinerary).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
