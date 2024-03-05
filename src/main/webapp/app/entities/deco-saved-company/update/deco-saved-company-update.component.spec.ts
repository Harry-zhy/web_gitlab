import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecoSavedCompanyFormService } from './deco-saved-company-form.service';
import { DecoSavedCompanyService } from '../service/deco-saved-company.service';
import { IDecoSavedCompany } from '../deco-saved-company.model';

import { DecoSavedCompanyUpdateComponent } from './deco-saved-company-update.component';

describe('DecoSavedCompany Management Update Component', () => {
  let comp: DecoSavedCompanyUpdateComponent;
  let fixture: ComponentFixture<DecoSavedCompanyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decoSavedCompanyFormService: DecoSavedCompanyFormService;
  let decoSavedCompanyService: DecoSavedCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecoSavedCompanyUpdateComponent],
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
      .overrideTemplate(DecoSavedCompanyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoSavedCompanyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decoSavedCompanyFormService = TestBed.inject(DecoSavedCompanyFormService);
    decoSavedCompanyService = TestBed.inject(DecoSavedCompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const decoSavedCompany: IDecoSavedCompany = { id: 456 };

      activatedRoute.data = of({ decoSavedCompany });
      comp.ngOnInit();

      expect(comp.decoSavedCompany).toEqual(decoSavedCompany);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoSavedCompany>>();
      const decoSavedCompany = { id: 123 };
      jest.spyOn(decoSavedCompanyFormService, 'getDecoSavedCompany').mockReturnValue(decoSavedCompany);
      jest.spyOn(decoSavedCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoSavedCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoSavedCompany }));
      saveSubject.complete();

      // THEN
      expect(decoSavedCompanyFormService.getDecoSavedCompany).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decoSavedCompanyService.update).toHaveBeenCalledWith(expect.objectContaining(decoSavedCompany));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoSavedCompany>>();
      const decoSavedCompany = { id: 123 };
      jest.spyOn(decoSavedCompanyFormService, 'getDecoSavedCompany').mockReturnValue({ id: null });
      jest.spyOn(decoSavedCompanyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoSavedCompany: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoSavedCompany }));
      saveSubject.complete();

      // THEN
      expect(decoSavedCompanyFormService.getDecoSavedCompany).toHaveBeenCalled();
      expect(decoSavedCompanyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoSavedCompany>>();
      const decoSavedCompany = { id: 123 };
      jest.spyOn(decoSavedCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoSavedCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decoSavedCompanyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
