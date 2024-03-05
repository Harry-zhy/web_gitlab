import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FeedbacksFormService } from './feedbacks-form.service';
import { FeedbacksService } from '../service/feedbacks.service';
import { IFeedbacks } from '../feedbacks.model';
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

import { FeedbacksUpdateComponent } from './feedbacks-update.component';

describe('Feedbacks Management Update Component', () => {
  let comp: FeedbacksUpdateComponent;
  let fixture: ComponentFixture<FeedbacksUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feedbacksFormService: FeedbacksFormService;
  let feedbacksService: FeedbacksService;
  let ratingService: RatingService;
  let supplierService: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FeedbacksUpdateComponent],
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
      .overrideTemplate(FeedbacksUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeedbacksUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feedbacksFormService = TestBed.inject(FeedbacksFormService);
    feedbacksService = TestBed.inject(FeedbacksService);
    ratingService = TestBed.inject(RatingService);
    supplierService = TestBed.inject(SupplierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Rating query and add missing value', () => {
      const feedbacks: IFeedbacks = { id: 456 };
      const rating: IRating = { id: 73988 };
      feedbacks.rating = rating;

      const ratingCollection: IRating[] = [{ id: 11210 }];
      jest.spyOn(ratingService, 'query').mockReturnValue(of(new HttpResponse({ body: ratingCollection })));
      const additionalRatings = [rating];
      const expectedCollection: IRating[] = [...additionalRatings, ...ratingCollection];
      jest.spyOn(ratingService, 'addRatingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feedbacks });
      comp.ngOnInit();

      expect(ratingService.query).toHaveBeenCalled();
      expect(ratingService.addRatingToCollectionIfMissing).toHaveBeenCalledWith(
        ratingCollection,
        ...additionalRatings.map(expect.objectContaining)
      );
      expect(comp.ratingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Supplier query and add missing value', () => {
      const feedbacks: IFeedbacks = { id: 456 };
      const supplier: ISupplier = { id: 16178 };
      feedbacks.supplier = supplier;

      const supplierCollection: ISupplier[] = [{ id: 88325 }];
      jest.spyOn(supplierService, 'query').mockReturnValue(of(new HttpResponse({ body: supplierCollection })));
      const additionalSuppliers = [supplier];
      const expectedCollection: ISupplier[] = [...additionalSuppliers, ...supplierCollection];
      jest.spyOn(supplierService, 'addSupplierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feedbacks });
      comp.ngOnInit();

      expect(supplierService.query).toHaveBeenCalled();
      expect(supplierService.addSupplierToCollectionIfMissing).toHaveBeenCalledWith(
        supplierCollection,
        ...additionalSuppliers.map(expect.objectContaining)
      );
      expect(comp.suppliersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const feedbacks: IFeedbacks = { id: 456 };
      const rating: IRating = { id: 1978 };
      feedbacks.rating = rating;
      const supplier: ISupplier = { id: 62786 };
      feedbacks.supplier = supplier;

      activatedRoute.data = of({ feedbacks });
      comp.ngOnInit();

      expect(comp.ratingsSharedCollection).toContain(rating);
      expect(comp.suppliersSharedCollection).toContain(supplier);
      expect(comp.feedbacks).toEqual(feedbacks);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFeedbacks>>();
      const feedbacks = { id: 123 };
      jest.spyOn(feedbacksFormService, 'getFeedbacks').mockReturnValue(feedbacks);
      jest.spyOn(feedbacksService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feedbacks });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feedbacks }));
      saveSubject.complete();

      // THEN
      expect(feedbacksFormService.getFeedbacks).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(feedbacksService.update).toHaveBeenCalledWith(expect.objectContaining(feedbacks));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFeedbacks>>();
      const feedbacks = { id: 123 };
      jest.spyOn(feedbacksFormService, 'getFeedbacks').mockReturnValue({ id: null });
      jest.spyOn(feedbacksService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feedbacks: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feedbacks }));
      saveSubject.complete();

      // THEN
      expect(feedbacksFormService.getFeedbacks).toHaveBeenCalled();
      expect(feedbacksService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFeedbacks>>();
      const feedbacks = { id: 123 };
      jest.spyOn(feedbacksService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feedbacks });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feedbacksService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRating', () => {
      it('Should forward to ratingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ratingService, 'compareRating');
        comp.compareRating(entity, entity2);
        expect(ratingService.compareRating).toHaveBeenCalledWith(entity, entity2);
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
  });
});
