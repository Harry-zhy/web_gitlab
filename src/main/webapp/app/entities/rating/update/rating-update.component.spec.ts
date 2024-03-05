import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RatingFormService } from './rating-form.service';
import { RatingService } from '../service/rating.service';
import { IRating } from '../rating.model';
import { ICaterers } from 'app/entities/caterers/caterers.model';
import { CaterersService } from 'app/entities/caterers/service/caterers.service';
import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { ActivityCompanyService } from 'app/entities/activity-company/service/activity-company.service';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';
import { BookedActivityService } from 'app/entities/booked-activity/service/booked-activity.service';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { ActivitySelfService } from 'app/entities/activity-self/service/activity-self.service';

import { RatingUpdateComponent } from './rating-update.component';

describe('Rating Management Update Component', () => {
  let comp: RatingUpdateComponent;
  let fixture: ComponentFixture<RatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ratingFormService: RatingFormService;
  let ratingService: RatingService;
  let caterersService: CaterersService;
  let activityCompanyService: ActivityCompanyService;
  let bookedActivityService: BookedActivityService;
  let activitySelfService: ActivitySelfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RatingUpdateComponent],
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
      .overrideTemplate(RatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ratingFormService = TestBed.inject(RatingFormService);
    ratingService = TestBed.inject(RatingService);
    caterersService = TestBed.inject(CaterersService);
    activityCompanyService = TestBed.inject(ActivityCompanyService);
    bookedActivityService = TestBed.inject(BookedActivityService);
    activitySelfService = TestBed.inject(ActivitySelfService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Caterers query and add missing value', () => {
      const rating: IRating = { id: 456 };
      const caterers: ICaterers = { id: 82202 };
      rating.caterers = caterers;

      const caterersCollection: ICaterers[] = [{ id: 69945 }];
      jest.spyOn(caterersService, 'query').mockReturnValue(of(new HttpResponse({ body: caterersCollection })));
      const additionalCaterers = [caterers];
      const expectedCollection: ICaterers[] = [...additionalCaterers, ...caterersCollection];
      jest.spyOn(caterersService, 'addCaterersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(caterersService.query).toHaveBeenCalled();
      expect(caterersService.addCaterersToCollectionIfMissing).toHaveBeenCalledWith(
        caterersCollection,
        ...additionalCaterers.map(expect.objectContaining)
      );
      expect(comp.caterersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ActivityCompany query and add missing value', () => {
      const rating: IRating = { id: 456 };
      const activityCompany: IActivityCompany = { id: 6127 };
      rating.activityCompany = activityCompany;

      const activityCompanyCollection: IActivityCompany[] = [{ id: 4636 }];
      jest.spyOn(activityCompanyService, 'query').mockReturnValue(of(new HttpResponse({ body: activityCompanyCollection })));
      const additionalActivityCompanies = [activityCompany];
      const expectedCollection: IActivityCompany[] = [...additionalActivityCompanies, ...activityCompanyCollection];
      jest.spyOn(activityCompanyService, 'addActivityCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(activityCompanyService.query).toHaveBeenCalled();
      expect(activityCompanyService.addActivityCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        activityCompanyCollection,
        ...additionalActivityCompanies.map(expect.objectContaining)
      );
      expect(comp.activityCompaniesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BookedActivity query and add missing value', () => {
      const rating: IRating = { id: 456 };
      const bookedActivity: IBookedActivity = { id: 18314 };
      rating.bookedActivity = bookedActivity;

      const bookedActivityCollection: IBookedActivity[] = [{ id: 78339 }];
      jest.spyOn(bookedActivityService, 'query').mockReturnValue(of(new HttpResponse({ body: bookedActivityCollection })));
      const additionalBookedActivities = [bookedActivity];
      const expectedCollection: IBookedActivity[] = [...additionalBookedActivities, ...bookedActivityCollection];
      jest.spyOn(bookedActivityService, 'addBookedActivityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(bookedActivityService.query).toHaveBeenCalled();
      expect(bookedActivityService.addBookedActivityToCollectionIfMissing).toHaveBeenCalledWith(
        bookedActivityCollection,
        ...additionalBookedActivities.map(expect.objectContaining)
      );
      expect(comp.bookedActivitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ActivitySelf query and add missing value', () => {
      const rating: IRating = { id: 456 };
      const activitySelf: IActivitySelf = { id: 99416 };
      rating.activitySelf = activitySelf;

      const activitySelfCollection: IActivitySelf[] = [{ id: 19969 }];
      jest.spyOn(activitySelfService, 'query').mockReturnValue(of(new HttpResponse({ body: activitySelfCollection })));
      const additionalActivitySelves = [activitySelf];
      const expectedCollection: IActivitySelf[] = [...additionalActivitySelves, ...activitySelfCollection];
      jest.spyOn(activitySelfService, 'addActivitySelfToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(activitySelfService.query).toHaveBeenCalled();
      expect(activitySelfService.addActivitySelfToCollectionIfMissing).toHaveBeenCalledWith(
        activitySelfCollection,
        ...additionalActivitySelves.map(expect.objectContaining)
      );
      expect(comp.activitySelvesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const rating: IRating = { id: 456 };
      const caterers: ICaterers = { id: 27902 };
      rating.caterers = caterers;
      const activityCompany: IActivityCompany = { id: 34872 };
      rating.activityCompany = activityCompany;
      const bookedActivity: IBookedActivity = { id: 21861 };
      rating.bookedActivity = bookedActivity;
      const activitySelf: IActivitySelf = { id: 81143 };
      rating.activitySelf = activitySelf;

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(comp.caterersSharedCollection).toContain(caterers);
      expect(comp.activityCompaniesSharedCollection).toContain(activityCompany);
      expect(comp.bookedActivitiesSharedCollection).toContain(bookedActivity);
      expect(comp.activitySelvesSharedCollection).toContain(activitySelf);
      expect(comp.rating).toEqual(rating);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingFormService, 'getRating').mockReturnValue(rating);
      jest.spyOn(ratingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rating }));
      saveSubject.complete();

      // THEN
      expect(ratingFormService.getRating).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ratingService.update).toHaveBeenCalledWith(expect.objectContaining(rating));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingFormService, 'getRating').mockReturnValue({ id: null });
      jest.spyOn(ratingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rating }));
      saveSubject.complete();

      // THEN
      expect(ratingFormService.getRating).toHaveBeenCalled();
      expect(ratingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ratingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCaterers', () => {
      it('Should forward to caterersService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(caterersService, 'compareCaterers');
        comp.compareCaterers(entity, entity2);
        expect(caterersService.compareCaterers).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActivityCompany', () => {
      it('Should forward to activityCompanyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activityCompanyService, 'compareActivityCompany');
        comp.compareActivityCompany(entity, entity2);
        expect(activityCompanyService.compareActivityCompany).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareActivitySelf', () => {
      it('Should forward to activitySelfService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activitySelfService, 'compareActivitySelf');
        comp.compareActivitySelf(entity, entity2);
        expect(activitySelfService.compareActivitySelf).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
