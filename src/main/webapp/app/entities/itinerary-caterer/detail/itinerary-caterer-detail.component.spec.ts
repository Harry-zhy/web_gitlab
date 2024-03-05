import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItineraryCatererDetailComponent } from './itinerary-caterer-detail.component';

describe('ItineraryCaterer Management Detail Component', () => {
  let comp: ItineraryCatererDetailComponent;
  let fixture: ComponentFixture<ItineraryCatererDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryCatererDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itineraryCaterer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItineraryCatererDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItineraryCatererDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itineraryCaterer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itineraryCaterer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
