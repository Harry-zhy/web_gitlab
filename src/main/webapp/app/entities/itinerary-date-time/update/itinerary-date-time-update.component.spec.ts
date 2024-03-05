import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItineraryDateTimeFormService } from './itinerary-date-time-form.service';
import { ItineraryDateTimeService } from '../service/itinerary-date-time.service';
import { IItineraryDateTime } from '../itinerary-date-time.model';

import { ItineraryDateTimeUpdateComponent } from './itinerary-date-time-update.component';

describe('ItineraryDateTime Management Update Component', () => {
  let comp: ItineraryDateTimeUpdateComponent;
  let fixture: ComponentFixture<ItineraryDateTimeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itineraryDateTimeFormService: ItineraryDateTimeFormService;
  let itineraryDateTimeService: ItineraryDateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItineraryDateTimeUpdateComponent],
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
      .overrideTemplate(ItineraryDateTimeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryDateTimeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itineraryDateTimeFormService = TestBed.inject(ItineraryDateTimeFormService);
    itineraryDateTimeService = TestBed.inject(ItineraryDateTimeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const itineraryDateTime: IItineraryDateTime = { id: 456 };

      activatedRoute.data = of({ itineraryDateTime });
      comp.ngOnInit();

      expect(comp.itineraryDateTime).toEqual(itineraryDateTime);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryDateTime>>();
      const itineraryDateTime = { id: 123 };
      jest.spyOn(itineraryDateTimeFormService, 'getItineraryDateTime').mockReturnValue(itineraryDateTime);
      jest.spyOn(itineraryDateTimeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryDateTime });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryDateTime }));
      saveSubject.complete();

      // THEN
      expect(itineraryDateTimeFormService.getItineraryDateTime).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itineraryDateTimeService.update).toHaveBeenCalledWith(expect.objectContaining(itineraryDateTime));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryDateTime>>();
      const itineraryDateTime = { id: 123 };
      jest.spyOn(itineraryDateTimeFormService, 'getItineraryDateTime').mockReturnValue({ id: null });
      jest.spyOn(itineraryDateTimeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryDateTime: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryDateTime }));
      saveSubject.complete();

      // THEN
      expect(itineraryDateTimeFormService.getItineraryDateTime).toHaveBeenCalled();
      expect(itineraryDateTimeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryDateTime>>();
      const itineraryDateTime = { id: 123 };
      jest.spyOn(itineraryDateTimeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryDateTime });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itineraryDateTimeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
