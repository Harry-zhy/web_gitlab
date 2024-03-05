import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItineraryCatererFormService } from './itinerary-caterer-form.service';
import { ItineraryCatererService } from '../service/itinerary-caterer.service';
import { IItineraryCaterer } from '../itinerary-caterer.model';

import { ItineraryCatererUpdateComponent } from './itinerary-caterer-update.component';

describe('ItineraryCaterer Management Update Component', () => {
  let comp: ItineraryCatererUpdateComponent;
  let fixture: ComponentFixture<ItineraryCatererUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itineraryCatererFormService: ItineraryCatererFormService;
  let itineraryCatererService: ItineraryCatererService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItineraryCatererUpdateComponent],
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
      .overrideTemplate(ItineraryCatererUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryCatererUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itineraryCatererFormService = TestBed.inject(ItineraryCatererFormService);
    itineraryCatererService = TestBed.inject(ItineraryCatererService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const itineraryCaterer: IItineraryCaterer = { id: 456 };

      activatedRoute.data = of({ itineraryCaterer });
      comp.ngOnInit();

      expect(comp.itineraryCaterer).toEqual(itineraryCaterer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryCaterer>>();
      const itineraryCaterer = { id: 123 };
      jest.spyOn(itineraryCatererFormService, 'getItineraryCaterer').mockReturnValue(itineraryCaterer);
      jest.spyOn(itineraryCatererService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryCaterer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryCaterer }));
      saveSubject.complete();

      // THEN
      expect(itineraryCatererFormService.getItineraryCaterer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itineraryCatererService.update).toHaveBeenCalledWith(expect.objectContaining(itineraryCaterer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryCaterer>>();
      const itineraryCaterer = { id: 123 };
      jest.spyOn(itineraryCatererFormService, 'getItineraryCaterer').mockReturnValue({ id: null });
      jest.spyOn(itineraryCatererService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryCaterer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryCaterer }));
      saveSubject.complete();

      // THEN
      expect(itineraryCatererFormService.getItineraryCaterer).toHaveBeenCalled();
      expect(itineraryCatererService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryCaterer>>();
      const itineraryCaterer = { id: 123 };
      jest.spyOn(itineraryCatererService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryCaterer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itineraryCatererService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
