import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecoContactDetailsFormService } from './deco-contact-details-form.service';
import { DecoContactDetailsService } from '../service/deco-contact-details.service';
import { IDecoContactDetails } from '../deco-contact-details.model';

import { DecoContactDetailsUpdateComponent } from './deco-contact-details-update.component';

describe('DecoContactDetails Management Update Component', () => {
  let comp: DecoContactDetailsUpdateComponent;
  let fixture: ComponentFixture<DecoContactDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decoContactDetailsFormService: DecoContactDetailsFormService;
  let decoContactDetailsService: DecoContactDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecoContactDetailsUpdateComponent],
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
      .overrideTemplate(DecoContactDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoContactDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decoContactDetailsFormService = TestBed.inject(DecoContactDetailsFormService);
    decoContactDetailsService = TestBed.inject(DecoContactDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const decoContactDetails: IDecoContactDetails = { id: 456 };

      activatedRoute.data = of({ decoContactDetails });
      comp.ngOnInit();

      expect(comp.decoContactDetails).toEqual(decoContactDetails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoContactDetails>>();
      const decoContactDetails = { id: 123 };
      jest.spyOn(decoContactDetailsFormService, 'getDecoContactDetails').mockReturnValue(decoContactDetails);
      jest.spyOn(decoContactDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoContactDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoContactDetails }));
      saveSubject.complete();

      // THEN
      expect(decoContactDetailsFormService.getDecoContactDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decoContactDetailsService.update).toHaveBeenCalledWith(expect.objectContaining(decoContactDetails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoContactDetails>>();
      const decoContactDetails = { id: 123 };
      jest.spyOn(decoContactDetailsFormService, 'getDecoContactDetails').mockReturnValue({ id: null });
      jest.spyOn(decoContactDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoContactDetails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoContactDetails }));
      saveSubject.complete();

      // THEN
      expect(decoContactDetailsFormService.getDecoContactDetails).toHaveBeenCalled();
      expect(decoContactDetailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoContactDetails>>();
      const decoContactDetails = { id: 123 };
      jest.spyOn(decoContactDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoContactDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decoContactDetailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
