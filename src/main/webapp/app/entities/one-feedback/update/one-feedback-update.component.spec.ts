import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OneFeedbackFormService } from './one-feedback-form.service';
import { OneFeedbackService } from '../service/one-feedback.service';
import { IOneFeedback } from '../one-feedback.model';
import { IFeedbacks } from 'app/entities/feedbacks/feedbacks.model';
import { FeedbacksService } from 'app/entities/feedbacks/service/feedbacks.service';

import { OneFeedbackUpdateComponent } from './one-feedback-update.component';

describe('OneFeedback Management Update Component', () => {
  let comp: OneFeedbackUpdateComponent;
  let fixture: ComponentFixture<OneFeedbackUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let oneFeedbackFormService: OneFeedbackFormService;
  let oneFeedbackService: OneFeedbackService;
  let feedbacksService: FeedbacksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OneFeedbackUpdateComponent],
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
      .overrideTemplate(OneFeedbackUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OneFeedbackUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    oneFeedbackFormService = TestBed.inject(OneFeedbackFormService);
    oneFeedbackService = TestBed.inject(OneFeedbackService);
    feedbacksService = TestBed.inject(FeedbacksService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Feedbacks query and add missing value', () => {
      const oneFeedback: IOneFeedback = { id: 456 };
      const feedbacks: IFeedbacks = { id: 86361 };
      oneFeedback.feedbacks = feedbacks;

      const feedbacksCollection: IFeedbacks[] = [{ id: 10575 }];
      jest.spyOn(feedbacksService, 'query').mockReturnValue(of(new HttpResponse({ body: feedbacksCollection })));
      const additionalFeedbacks = [feedbacks];
      const expectedCollection: IFeedbacks[] = [...additionalFeedbacks, ...feedbacksCollection];
      jest.spyOn(feedbacksService, 'addFeedbacksToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ oneFeedback });
      comp.ngOnInit();

      expect(feedbacksService.query).toHaveBeenCalled();
      expect(feedbacksService.addFeedbacksToCollectionIfMissing).toHaveBeenCalledWith(
        feedbacksCollection,
        ...additionalFeedbacks.map(expect.objectContaining)
      );
      expect(comp.feedbacksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const oneFeedback: IOneFeedback = { id: 456 };
      const feedbacks: IFeedbacks = { id: 74094 };
      oneFeedback.feedbacks = feedbacks;

      activatedRoute.data = of({ oneFeedback });
      comp.ngOnInit();

      expect(comp.feedbacksSharedCollection).toContain(feedbacks);
      expect(comp.oneFeedback).toEqual(oneFeedback);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOneFeedback>>();
      const oneFeedback = { id: 123 };
      jest.spyOn(oneFeedbackFormService, 'getOneFeedback').mockReturnValue(oneFeedback);
      jest.spyOn(oneFeedbackService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ oneFeedback });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: oneFeedback }));
      saveSubject.complete();

      // THEN
      expect(oneFeedbackFormService.getOneFeedback).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(oneFeedbackService.update).toHaveBeenCalledWith(expect.objectContaining(oneFeedback));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOneFeedback>>();
      const oneFeedback = { id: 123 };
      jest.spyOn(oneFeedbackFormService, 'getOneFeedback').mockReturnValue({ id: null });
      jest.spyOn(oneFeedbackService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ oneFeedback: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: oneFeedback }));
      saveSubject.complete();

      // THEN
      expect(oneFeedbackFormService.getOneFeedback).toHaveBeenCalled();
      expect(oneFeedbackService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOneFeedback>>();
      const oneFeedback = { id: 123 };
      jest.spyOn(oneFeedbackService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ oneFeedback });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(oneFeedbackService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFeedbacks', () => {
      it('Should forward to feedbacksService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(feedbacksService, 'compareFeedbacks');
        comp.compareFeedbacks(entity, entity2);
        expect(feedbacksService.compareFeedbacks).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
