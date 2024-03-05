import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AdsManagementFormService } from './ads-management-form.service';
import { AdsManagementService } from '../service/ads-management.service';
import { IAdsManagement } from '../ads-management.model';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

import { AdsManagementUpdateComponent } from './ads-management-update.component';

describe('AdsManagement Management Update Component', () => {
  let comp: AdsManagementUpdateComponent;
  let fixture: ComponentFixture<AdsManagementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let adsManagementFormService: AdsManagementFormService;
  let adsManagementService: AdsManagementService;
  let supplierService: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AdsManagementUpdateComponent],
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
      .overrideTemplate(AdsManagementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdsManagementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    adsManagementFormService = TestBed.inject(AdsManagementFormService);
    adsManagementService = TestBed.inject(AdsManagementService);
    supplierService = TestBed.inject(SupplierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Supplier query and add missing value', () => {
      const adsManagement: IAdsManagement = { id: 456 };
      const supplier: ISupplier = { id: 50930 };
      adsManagement.supplier = supplier;

      const supplierCollection: ISupplier[] = [{ id: 94664 }];
      jest.spyOn(supplierService, 'query').mockReturnValue(of(new HttpResponse({ body: supplierCollection })));
      const additionalSuppliers = [supplier];
      const expectedCollection: ISupplier[] = [...additionalSuppliers, ...supplierCollection];
      jest.spyOn(supplierService, 'addSupplierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ adsManagement });
      comp.ngOnInit();

      expect(supplierService.query).toHaveBeenCalled();
      expect(supplierService.addSupplierToCollectionIfMissing).toHaveBeenCalledWith(
        supplierCollection,
        ...additionalSuppliers.map(expect.objectContaining)
      );
      expect(comp.suppliersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const adsManagement: IAdsManagement = { id: 456 };
      const supplier: ISupplier = { id: 10190 };
      adsManagement.supplier = supplier;

      activatedRoute.data = of({ adsManagement });
      comp.ngOnInit();

      expect(comp.suppliersSharedCollection).toContain(supplier);
      expect(comp.adsManagement).toEqual(adsManagement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdsManagement>>();
      const adsManagement = { id: 123 };
      jest.spyOn(adsManagementFormService, 'getAdsManagement').mockReturnValue(adsManagement);
      jest.spyOn(adsManagementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adsManagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adsManagement }));
      saveSubject.complete();

      // THEN
      expect(adsManagementFormService.getAdsManagement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(adsManagementService.update).toHaveBeenCalledWith(expect.objectContaining(adsManagement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdsManagement>>();
      const adsManagement = { id: 123 };
      jest.spyOn(adsManagementFormService, 'getAdsManagement').mockReturnValue({ id: null });
      jest.spyOn(adsManagementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adsManagement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adsManagement }));
      saveSubject.complete();

      // THEN
      expect(adsManagementFormService.getAdsManagement).toHaveBeenCalled();
      expect(adsManagementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdsManagement>>();
      const adsManagement = { id: 123 };
      jest.spyOn(adsManagementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adsManagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(adsManagementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSupplier', () => {
      it('Should forward to supplierService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(supplierService, 'compareSupplier');
        comp.compareSupplier(entity, entity2);
        expect(supplierService.compareSupplier).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
