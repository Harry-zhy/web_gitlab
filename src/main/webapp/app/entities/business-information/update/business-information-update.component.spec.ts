import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BusinessInformationFormService } from './business-information-form.service';
import { BusinessInformationService } from '../service/business-information.service';
import { IBusinessInformation } from '../business-information.model';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

import { BusinessInformationUpdateComponent } from './business-information-update.component';

describe('BusinessInformation Management Update Component', () => {
  let comp: BusinessInformationUpdateComponent;
  let fixture: ComponentFixture<BusinessInformationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let businessInformationFormService: BusinessInformationFormService;
  let businessInformationService: BusinessInformationService;
  let supplierService: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BusinessInformationUpdateComponent],
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
      .overrideTemplate(BusinessInformationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessInformationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    businessInformationFormService = TestBed.inject(BusinessInformationFormService);
    businessInformationService = TestBed.inject(BusinessInformationService);
    supplierService = TestBed.inject(SupplierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Supplier query and add missing value', () => {
      const businessInformation: IBusinessInformation = { id: 456 };
      const supplier: ISupplier = { id: 49671 };
      businessInformation.supplier = supplier;

      const supplierCollection: ISupplier[] = [{ id: 6666 }];
      jest.spyOn(supplierService, 'query').mockReturnValue(of(new HttpResponse({ body: supplierCollection })));
      const additionalSuppliers = [supplier];
      const expectedCollection: ISupplier[] = [...additionalSuppliers, ...supplierCollection];
      jest.spyOn(supplierService, 'addSupplierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ businessInformation });
      comp.ngOnInit();

      expect(supplierService.query).toHaveBeenCalled();
      expect(supplierService.addSupplierToCollectionIfMissing).toHaveBeenCalledWith(
        supplierCollection,
        ...additionalSuppliers.map(expect.objectContaining)
      );
      expect(comp.suppliersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const businessInformation: IBusinessInformation = { id: 456 };
      const supplier: ISupplier = { id: 68213 };
      businessInformation.supplier = supplier;

      activatedRoute.data = of({ businessInformation });
      comp.ngOnInit();

      expect(comp.suppliersSharedCollection).toContain(supplier);
      expect(comp.businessInformation).toEqual(businessInformation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessInformation>>();
      const businessInformation = { id: 123 };
      jest.spyOn(businessInformationFormService, 'getBusinessInformation').mockReturnValue(businessInformation);
      jest.spyOn(businessInformationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessInformation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessInformation }));
      saveSubject.complete();

      // THEN
      expect(businessInformationFormService.getBusinessInformation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(businessInformationService.update).toHaveBeenCalledWith(expect.objectContaining(businessInformation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessInformation>>();
      const businessInformation = { id: 123 };
      jest.spyOn(businessInformationFormService, 'getBusinessInformation').mockReturnValue({ id: null });
      jest.spyOn(businessInformationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessInformation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessInformation }));
      saveSubject.complete();

      // THEN
      expect(businessInformationFormService.getBusinessInformation).toHaveBeenCalled();
      expect(businessInformationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessInformation>>();
      const businessInformation = { id: 123 };
      jest.spyOn(businessInformationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessInformation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(businessInformationService.update).toHaveBeenCalled();
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
