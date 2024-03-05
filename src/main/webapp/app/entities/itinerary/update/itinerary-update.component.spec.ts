import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItineraryFormService } from './itinerary-form.service';
import { ItineraryService } from '../service/itinerary.service';
import { IItinerary } from '../itinerary.model';

import { ItineraryUpdateComponent } from './itinerary-update.component';

describe('Itinerary Management Update Component', () => {
  let comp: ItineraryUpdateComponent;
  let fixture: ComponentFixture<ItineraryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itineraryFormService: ItineraryFormService;
  let itineraryService: ItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItineraryUpdateComponent],
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
      .overrideTemplate(ItineraryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itineraryFormService = TestBed.inject(ItineraryFormService);
    itineraryService = TestBed.inject(ItineraryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const itinerary: IItinerary = { id: 456 };

      activatedRoute.data = of({ itinerary });
      comp.ngOnInit();

      expect(comp.itinerary).toEqual(itinerary);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItinerary>>();
      const itinerary = { id: 123 };
      jest.spyOn(itineraryFormService, 'getItinerary').mockReturnValue(itinerary);
      jest.spyOn(itineraryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itinerary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itinerary }));
      saveSubject.complete();

      // THEN
      expect(itineraryFormService.getItinerary).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itineraryService.update).toHaveBeenCalledWith(expect.objectContaining(itinerary));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItinerary>>();
      const itinerary = { id: 123 };
      jest.spyOn(itineraryFormService, 'getItinerary').mockReturnValue({ id: null });
      jest.spyOn(itineraryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itinerary: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itinerary }));
      saveSubject.complete();

      // THEN
      expect(itineraryFormService.getItinerary).toHaveBeenCalled();
      expect(itineraryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItinerary>>();
      const itinerary = { id: 123 };
      jest.spyOn(itineraryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itinerary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itineraryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
