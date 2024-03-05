import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItineraryActivityFormService } from './itinerary-activity-form.service';
import { ItineraryActivityService } from '../service/itinerary-activity.service';
import { IItineraryActivity } from '../itinerary-activity.model';

import { ItineraryActivityUpdateComponent } from './itinerary-activity-update.component';

describe('ItineraryActivity Management Update Component', () => {
  let comp: ItineraryActivityUpdateComponent;
  let fixture: ComponentFixture<ItineraryActivityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itineraryActivityFormService: ItineraryActivityFormService;
  let itineraryActivityService: ItineraryActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItineraryActivityUpdateComponent],
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
      .overrideTemplate(ItineraryActivityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryActivityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itineraryActivityFormService = TestBed.inject(ItineraryActivityFormService);
    itineraryActivityService = TestBed.inject(ItineraryActivityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const itineraryActivity: IItineraryActivity = { id: 456 };

      activatedRoute.data = of({ itineraryActivity });
      comp.ngOnInit();

      expect(comp.itineraryActivity).toEqual(itineraryActivity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryActivity>>();
      const itineraryActivity = { id: 123 };
      jest.spyOn(itineraryActivityFormService, 'getItineraryActivity').mockReturnValue(itineraryActivity);
      jest.spyOn(itineraryActivityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryActivity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryActivity }));
      saveSubject.complete();

      // THEN
      expect(itineraryActivityFormService.getItineraryActivity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itineraryActivityService.update).toHaveBeenCalledWith(expect.objectContaining(itineraryActivity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryActivity>>();
      const itineraryActivity = { id: 123 };
      jest.spyOn(itineraryActivityFormService, 'getItineraryActivity').mockReturnValue({ id: null });
      jest.spyOn(itineraryActivityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryActivity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryActivity }));
      saveSubject.complete();

      // THEN
      expect(itineraryActivityFormService.getItineraryActivity).toHaveBeenCalled();
      expect(itineraryActivityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryActivity>>();
      const itineraryActivity = { id: 123 };
      jest.spyOn(itineraryActivityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryActivity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itineraryActivityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
