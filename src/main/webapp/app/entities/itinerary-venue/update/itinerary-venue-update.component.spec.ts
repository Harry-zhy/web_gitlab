import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItineraryVenueFormService } from './itinerary-venue-form.service';
import { ItineraryVenueService } from '../service/itinerary-venue.service';
import { IItineraryVenue } from '../itinerary-venue.model';

import { ItineraryVenueUpdateComponent } from './itinerary-venue-update.component';

describe('ItineraryVenue Management Update Component', () => {
  let comp: ItineraryVenueUpdateComponent;
  let fixture: ComponentFixture<ItineraryVenueUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itineraryVenueFormService: ItineraryVenueFormService;
  let itineraryVenueService: ItineraryVenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItineraryVenueUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ItineraryVenueUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryVenueUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itineraryVenueFormService = TestBed.inject(ItineraryVenueFormService);
    itineraryVenueService = TestBed.inject(ItineraryVenueService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const itineraryVenue: IItineraryVenue = { id: 456 };

      activatedRoute.data = of({ itineraryVenue });
      comp.ngOnInit();

      expect(comp.itineraryVenue).toEqual(itineraryVenue);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryVenue>>();
      const itineraryVenue = { id: 123 };
      jest.spyOn(itineraryVenueFormService, 'getItineraryVenue').mockReturnValue(itineraryVenue);
      jest.spyOn(itineraryVenueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryVenue });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryVenue }));
      saveSubject.complete();

      // THEN
      expect(itineraryVenueFormService.getItineraryVenue).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itineraryVenueService.update).toHaveBeenCalledWith(expect.objectContaining(itineraryVenue));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryVenue>>();
      const itineraryVenue = { id: 123 };
      jest.spyOn(itineraryVenueFormService, 'getItineraryVenue').mockReturnValue({ id: null });
      jest.spyOn(itineraryVenueService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryVenue: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryVenue }));
      saveSubject.complete();

      // THEN
      expect(itineraryVenueFormService.getItineraryVenue).toHaveBeenCalled();
      expect(itineraryVenueService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryVenue>>();
      const itineraryVenue = { id: 123 };
      jest.spyOn(itineraryVenueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryVenue });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itineraryVenueService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
