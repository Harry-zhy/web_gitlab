import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActivityContactDetailsFormService } from './activity-contact-details-form.service';
import { ActivityContactDetailsService } from '../service/activity-contact-details.service';
import { IActivityContactDetails } from '../activity-contact-details.model';
import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { ActivityCompanyService } from 'app/entities/activity-company/service/activity-company.service';

import { ActivityContactDetailsUpdateComponent } from './activity-contact-details-update.component';

describe('ActivityContactDetails Management Update Component', () => {
  let comp: ActivityContactDetailsUpdateComponent;
  let fixture: ComponentFixture<ActivityContactDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let activityContactDetailsFormService: ActivityContactDetailsFormService;
  let activityContactDetailsService: ActivityContactDetailsService;
  let activityCompanyService: ActivityCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActivityContactDetailsUpdateComponent],
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
      .overrideTemplate(ActivityContactDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityContactDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activityContactDetailsFormService = TestBed.inject(ActivityContactDetailsFormService);
    activityContactDetailsService = TestBed.inject(ActivityContactDetailsService);
    activityCompanyService = TestBed.inject(ActivityCompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call activityCompany query and add missing value', () => {
      const activityContactDetails: IActivityContactDetails = { id: 456 };
      const activityCompany: IActivityCompany = { id: 60236 };
      activityContactDetails.activityCompany = activityCompany;

      const activityCompanyCollection: IActivityCompany[] = [{ id: 59798 }];
      jest.spyOn(activityCompanyService, 'query').mockReturnValue(of(new HttpResponse({ body: activityCompanyCollection })));
      const expectedCollection: IActivityCompany[] = [activityCompany, ...activityCompanyCollection];
      jest.spyOn(activityCompanyService, 'addActivityCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activityContactDetails });
      comp.ngOnInit();

      expect(activityCompanyService.query).toHaveBeenCalled();
      expect(activityCompanyService.addActivityCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        activityCompanyCollection,
        activityCompany
      );
      expect(comp.activityCompaniesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const activityContactDetails: IActivityContactDetails = { id: 456 };
      const activityCompany: IActivityCompany = { id: 28594 };
      activityContactDetails.activityCompany = activityCompany;

      activatedRoute.data = of({ activityContactDetails });
      comp.ngOnInit();

      expect(comp.activityCompaniesCollection).toContain(activityCompany);
      expect(comp.activityContactDetails).toEqual(activityContactDetails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityContactDetails>>();
      const activityContactDetails = { id: 123 };
      jest.spyOn(activityContactDetailsFormService, 'getActivityContactDetails').mockReturnValue(activityContactDetails);
      jest.spyOn(activityContactDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityContactDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityContactDetails }));
      saveSubject.complete();

      // THEN
      expect(activityContactDetailsFormService.getActivityContactDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(activityContactDetailsService.update).toHaveBeenCalledWith(expect.objectContaining(activityContactDetails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityContactDetails>>();
      const activityContactDetails = { id: 123 };
      jest.spyOn(activityContactDetailsFormService, 'getActivityContactDetails').mockReturnValue({ id: null });
      jest.spyOn(activityContactDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityContactDetails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityContactDetails }));
      saveSubject.complete();

      // THEN
      expect(activityContactDetailsFormService.getActivityContactDetails).toHaveBeenCalled();
      expect(activityContactDetailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityContactDetails>>();
      const activityContactDetails = { id: 123 };
      jest.spyOn(activityContactDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityContactDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(activityContactDetailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareActivityCompany', () => {
      it('Should forward to activityCompanyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activityCompanyService, 'compareActivityCompany');
        comp.compareActivityCompany(entity, entity2);
        expect(activityCompanyService.compareActivityCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
