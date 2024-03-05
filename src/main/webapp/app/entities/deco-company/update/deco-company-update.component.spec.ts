import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecoCompanyFormService } from './deco-company-form.service';
import { DecoCompanyService } from '../service/deco-company.service';
import { IDecoCompany } from '../deco-company.model';
import { IDecoContactDetails } from 'app/entities/deco-contact-details/deco-contact-details.model';
import { DecoContactDetailsService } from 'app/entities/deco-contact-details/service/deco-contact-details.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { IDecoSavedCompany } from 'app/entities/deco-saved-company/deco-saved-company.model';
import { DecoSavedCompanyService } from 'app/entities/deco-saved-company/service/deco-saved-company.service';

import { DecoCompanyUpdateComponent } from './deco-company-update.component';

describe('DecoCompany Management Update Component', () => {
  let comp: DecoCompanyUpdateComponent;
  let fixture: ComponentFixture<DecoCompanyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decoCompanyFormService: DecoCompanyFormService;
  let decoCompanyService: DecoCompanyService;
  let decoContactDetailsService: DecoContactDetailsService;
  let supplierService: SupplierService;
  let decoSavedCompanyService: DecoSavedCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecoCompanyUpdateComponent],
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
      .overrideTemplate(DecoCompanyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoCompanyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decoCompanyFormService = TestBed.inject(DecoCompanyFormService);
    decoCompanyService = TestBed.inject(DecoCompanyService);
    decoContactDetailsService = TestBed.inject(DecoContactDetailsService);
    supplierService = TestBed.inject(SupplierService);
    decoSavedCompanyService = TestBed.inject(DecoSavedCompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call decoContactDetails query and add missing value', () => {
      const decoCompany: IDecoCompany = { id: 456 };
      const decoContactDetails: IDecoContactDetails = { id: 24405 };
      decoCompany.decoContactDetails = decoContactDetails;

      const decoContactDetailsCollection: IDecoContactDetails[] = [{ id: 88469 }];
      jest.spyOn(decoContactDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: decoContactDetailsCollection })));
      const expectedCollection: IDecoContactDetails[] = [decoContactDetails, ...decoContactDetailsCollection];
      jest.spyOn(decoContactDetailsService, 'addDecoContactDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decoCompany });
      comp.ngOnInit();

      expect(decoContactDetailsService.query).toHaveBeenCalled();
      expect(decoContactDetailsService.addDecoContactDetailsToCollectionIfMissing).toHaveBeenCalledWith(
        decoContactDetailsCollection,
        decoContactDetails
      );
      expect(comp.decoContactDetailsCollection).toEqual(expectedCollection);
    });

    it('Should call supplier query and add missing value', () => {
      const decoCompany: IDecoCompany = { id: 456 };
      const supplier: ISupplier = { id: 85990 };
      decoCompany.supplier = supplier;

      const supplierCollection: ISupplier[] = [{ id: 76967 }];
      jest.spyOn(supplierService, 'query').mockReturnValue(of(new HttpResponse({ body: supplierCollection })));
      const expectedCollection: ISupplier[] = [supplier, ...supplierCollection];
      jest.spyOn(supplierService, 'addSupplierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decoCompany });
      comp.ngOnInit();

      expect(supplierService.query).toHaveBeenCalled();
      expect(supplierService.addSupplierToCollectionIfMissing).toHaveBeenCalledWith(supplierCollection, supplier);
      expect(comp.suppliersCollection).toEqual(expectedCollection);
    });

    it('Should call DecoSavedCompany query and add missing value', () => {
      const decoCompany: IDecoCompany = { id: 456 };
      const decoSavedCompanies: IDecoSavedCompany[] = [{ id: 13603 }];
      decoCompany.decoSavedCompanies = decoSavedCompanies;

      const decoSavedCompanyCollection: IDecoSavedCompany[] = [{ id: 25896 }];
      jest.spyOn(decoSavedCompanyService, 'query').mockReturnValue(of(new HttpResponse({ body: decoSavedCompanyCollection })));
      const additionalDecoSavedCompanies = [...decoSavedCompanies];
      const expectedCollection: IDecoSavedCompany[] = [...additionalDecoSavedCompanies, ...decoSavedCompanyCollection];
      jest.spyOn(decoSavedCompanyService, 'addDecoSavedCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decoCompany });
      comp.ngOnInit();

      expect(decoSavedCompanyService.query).toHaveBeenCalled();
      expect(decoSavedCompanyService.addDecoSavedCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        decoSavedCompanyCollection,
        ...additionalDecoSavedCompanies.map(expect.objectContaining)
      );
      expect(comp.decoSavedCompaniesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const decoCompany: IDecoCompany = { id: 456 };
      const decoContactDetails: IDecoContactDetails = { id: 32733 };
      decoCompany.decoContactDetails = decoContactDetails;
      const supplier: ISupplier = { id: 8288 };
      decoCompany.supplier = supplier;
      const decoSavedCompany: IDecoSavedCompany = { id: 41946 };
      decoCompany.decoSavedCompanies = [decoSavedCompany];

      activatedRoute.data = of({ decoCompany });
      comp.ngOnInit();

      expect(comp.decoContactDetailsCollection).toContain(decoContactDetails);
      expect(comp.suppliersCollection).toContain(supplier);
      expect(comp.decoSavedCompaniesSharedCollection).toContain(decoSavedCompany);
      expect(comp.decoCompany).toEqual(decoCompany);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoCompany>>();
      const decoCompany = { id: 123 };
      jest.spyOn(decoCompanyFormService, 'getDecoCompany').mockReturnValue(decoCompany);
      jest.spyOn(decoCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoCompany }));
      saveSubject.complete();

      // THEN
      expect(decoCompanyFormService.getDecoCompany).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decoCompanyService.update).toHaveBeenCalledWith(expect.objectContaining(decoCompany));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoCompany>>();
      const decoCompany = { id: 123 };
      jest.spyOn(decoCompanyFormService, 'getDecoCompany').mockReturnValue({ id: null });
      jest.spyOn(decoCompanyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoCompany: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoCompany }));
      saveSubject.complete();

      // THEN
      expect(decoCompanyFormService.getDecoCompany).toHaveBeenCalled();
      expect(decoCompanyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoCompany>>();
      const decoCompany = { id: 123 };
      jest.spyOn(decoCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decoCompanyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDecoContactDetails', () => {
      it('Should forward to decoContactDetailsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(decoContactDetailsService, 'compareDecoContactDetails');
        comp.compareDecoContactDetails(entity, entity2);
        expect(decoContactDetailsService.compareDecoContactDetails).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSupplier', () => {
      it('Should forward to supplierService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(supplierService, 'compareSupplier');
        comp.compareSupplier(entity, entity2);
        expect(supplierService.compareSupplier).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDecoSavedCompany', () => {
      it('Should forward to decoSavedCompanyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(decoSavedCompanyService, 'compareDecoSavedCompany');
        comp.compareDecoSavedCompany(entity, entity2);
        expect(decoSavedCompanyService.compareDecoSavedCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
