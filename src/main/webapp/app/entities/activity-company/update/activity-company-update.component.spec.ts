import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActivityCompanyFormService } from './activity-company-form.service';
import { ActivityCompanyService } from '../service/activity-company.service';
import { IActivityCompany } from '../activity-company.model';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';
import { BookedActivityService } from 'app/entities/booked-activity/service/booked-activity.service';

import { ActivityCompanyUpdateComponent } from './activity-company-update.component';

describe('ActivityCompany Management Update Component', () => {
  let comp: ActivityCompanyUpdateComponent;
  let fixture: ComponentFixture<ActivityCompanyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let activityCompanyFormService: ActivityCompanyFormService;
  let activityCompanyService: ActivityCompanyService;
  let supplierService: SupplierService;
  let bookedActivityService: BookedActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActivityCompanyUpdateComponent],
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
      .overrideTemplate(ActivityCompanyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityCompanyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activityCompanyFormService = TestBed.inject(ActivityCompanyFormService);
    activityCompanyService = TestBed.inject(ActivityCompanyService);
    supplierService = TestBed.inject(SupplierService);
    bookedActivityService = TestBed.inject(BookedActivityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call supplier query and add missing value', () => {
      const activityCompany: IActivityCompany = { id: 456 };
      const supplier: ISupplier = { id: 67914 };
      activityCompany.supplier = supplier;

      const supplierCollection: ISupplier[] = [{ id: 40368 }];
      jest.spyOn(supplierService, 'query').mockReturnValue(of(new HttpResponse({ body: supplierCollection })));
      const expectedCollection: ISupplier[] = [supplier, ...supplierCollection];
      jest.spyOn(supplierService, 'addSupplierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activityCompany });
      comp.ngOnInit();

      expect(supplierService.query).toHaveBeenCalled();
      expect(supplierService.addSupplierToCollectionIfMissing).toHaveBeenCalledWith(supplierCollection, supplier);
      expect(comp.suppliersCollection).toEqual(expectedCollection);
    });

    it('Should call BookedActivity query and add missing value', () => {
      const activityCompany: IActivityCompany = { id: 456 };
      const bookedActivity: IBookedActivity = { id: 66733 };
      activityCompany.bookedActivity = bookedActivity;

      const bookedActivityCollection: IBookedActivity[] = [{ id: 41540 }];
      jest.spyOn(bookedActivityService, 'query').mockReturnValue(of(new HttpResponse({ body: bookedActivityCollection })));
      const additionalBookedActivities = [bookedActivity];
      const expectedCollection: IBookedActivity[] = [...additionalBookedActivities, ...bookedActivityCollection];
      jest.spyOn(bookedActivityService, 'addBookedActivityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activityCompany });
      comp.ngOnInit();

      expect(bookedActivityService.query).toHaveBeenCalled();
      expect(bookedActivityService.addBookedActivityToCollectionIfMissing).toHaveBeenCalledWith(
        bookedActivityCollection,
        ...additionalBookedActivities.map(expect.objectContaining)
      );
      expect(comp.bookedActivitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const activityCompany: IActivityCompany = { id: 456 };
      const supplier: ISupplier = { id: 81798 };
      activityCompany.supplier = supplier;
      const bookedActivity: IBookedActivity = { id: 68338 };
      activityCompany.bookedActivity = bookedActivity;

      activatedRoute.data = of({ activityCompany });
      comp.ngOnInit();

      expect(comp.suppliersCollection).toContain(supplier);
      expect(comp.bookedActivitiesSharedCollection).toContain(bookedActivity);
      expect(comp.activityCompany).toEqual(activityCompany);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityCompany>>();
      const activityCompany = { id: 123 };
      jest.spyOn(activityCompanyFormService, 'getActivityCompany').mockReturnValue(activityCompany);
      jest.spyOn(activityCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityCompany }));
      saveSubject.complete();

      // THEN
      expect(activityCompanyFormService.getActivityCompany).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(activityCompanyService.update).toHaveBeenCalledWith(expect.objectContaining(activityCompany));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityCompany>>();
      const activityCompany = { id: 123 };
      jest.spyOn(activityCompanyFormService, 'getActivityCompany').mockReturnValue({ id: null });
      jest.spyOn(activityCompanyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityCompany: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityCompany }));
      saveSubject.complete();

      // THEN
      expect(activityCompanyFormService.getActivityCompany).toHaveBeenCalled();
      expect(activityCompanyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityCompany>>();
      const activityCompany = { id: 123 };
      jest.spyOn(activityCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(activityCompanyService.update).toHaveBeenCalled();
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

    describe('compareBookedActivity', () => {
      it('Should forward to bookedActivityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bookedActivityService, 'compareBookedActivity');
        comp.compareBookedActivity(entity, entity2);
        expect(bookedActivityService.compareBookedActivity).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
