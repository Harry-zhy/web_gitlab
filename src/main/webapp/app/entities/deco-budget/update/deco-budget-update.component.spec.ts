import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecoBudgetFormService } from './deco-budget-form.service';
import { DecoBudgetService } from '../service/deco-budget.service';
import { IDecoBudget } from '../deco-budget.model';
import { IDecoCompany } from 'app/entities/deco-company/deco-company.model';
import { DecoCompanyService } from 'app/entities/deco-company/service/deco-company.service';

import { DecoBudgetUpdateComponent } from './deco-budget-update.component';

describe('DecoBudget Management Update Component', () => {
  let comp: DecoBudgetUpdateComponent;
  let fixture: ComponentFixture<DecoBudgetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decoBudgetFormService: DecoBudgetFormService;
  let decoBudgetService: DecoBudgetService;
  let decoCompanyService: DecoCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecoBudgetUpdateComponent],
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
      .overrideTemplate(DecoBudgetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoBudgetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decoBudgetFormService = TestBed.inject(DecoBudgetFormService);
    decoBudgetService = TestBed.inject(DecoBudgetService);
    decoCompanyService = TestBed.inject(DecoCompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DecoCompany query and add missing value', () => {
      const decoBudget: IDecoBudget = { id: 456 };
      const decoCompanies: IDecoCompany[] = [{ id: 61396 }];
      decoBudget.decoCompanies = decoCompanies;

      const decoCompanyCollection: IDecoCompany[] = [{ id: 63737 }];
      jest.spyOn(decoCompanyService, 'query').mockReturnValue(of(new HttpResponse({ body: decoCompanyCollection })));
      const additionalDecoCompanies = [...decoCompanies];
      const expectedCollection: IDecoCompany[] = [...additionalDecoCompanies, ...decoCompanyCollection];
      jest.spyOn(decoCompanyService, 'addDecoCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decoBudget });
      comp.ngOnInit();

      expect(decoCompanyService.query).toHaveBeenCalled();
      expect(decoCompanyService.addDecoCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        decoCompanyCollection,
        ...additionalDecoCompanies.map(expect.objectContaining)
      );
      expect(comp.decoCompaniesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const decoBudget: IDecoBudget = { id: 456 };
      const decoCompany: IDecoCompany = { id: 18098 };
      decoBudget.decoCompanies = [decoCompany];

      activatedRoute.data = of({ decoBudget });
      comp.ngOnInit();

      expect(comp.decoCompaniesSharedCollection).toContain(decoCompany);
      expect(comp.decoBudget).toEqual(decoBudget);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoBudget>>();
      const decoBudget = { id: 123 };
      jest.spyOn(decoBudgetFormService, 'getDecoBudget').mockReturnValue(decoBudget);
      jest.spyOn(decoBudgetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoBudget });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoBudget }));
      saveSubject.complete();

      // THEN
      expect(decoBudgetFormService.getDecoBudget).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decoBudgetService.update).toHaveBeenCalledWith(expect.objectContaining(decoBudget));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoBudget>>();
      const decoBudget = { id: 123 };
      jest.spyOn(decoBudgetFormService, 'getDecoBudget').mockReturnValue({ id: null });
      jest.spyOn(decoBudgetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoBudget: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoBudget }));
      saveSubject.complete();

      // THEN
      expect(decoBudgetFormService.getDecoBudget).toHaveBeenCalled();
      expect(decoBudgetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoBudget>>();
      const decoBudget = { id: 123 };
      jest.spyOn(decoBudgetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoBudget });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decoBudgetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDecoCompany', () => {
      it('Should forward to decoCompanyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(decoCompanyService, 'compareDecoCompany');
        comp.compareDecoCompany(entity, entity2);
        expect(decoCompanyService.compareDecoCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
