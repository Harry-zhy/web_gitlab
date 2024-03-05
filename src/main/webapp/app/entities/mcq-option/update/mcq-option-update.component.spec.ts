import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MCQOptionFormService } from './mcq-option-form.service';
import { MCQOptionService } from '../service/mcq-option.service';
import { IMCQOption } from '../mcq-option.model';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

import { MCQOptionUpdateComponent } from './mcq-option-update.component';

describe('MCQOption Management Update Component', () => {
  let comp: MCQOptionUpdateComponent;
  let fixture: ComponentFixture<MCQOptionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mCQOptionFormService: MCQOptionFormService;
  let mCQOptionService: MCQOptionService;
  let questionService: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MCQOptionUpdateComponent],
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
      .overrideTemplate(MCQOptionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MCQOptionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mCQOptionFormService = TestBed.inject(MCQOptionFormService);
    mCQOptionService = TestBed.inject(MCQOptionService);
    questionService = TestBed.inject(QuestionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Question query and add missing value', () => {
      const mCQOption: IMCQOption = { id: 456 };
      const question: IQuestion = { id: 16151 };
      mCQOption.question = question;

      const questionCollection: IQuestion[] = [{ id: 98960 }];
      jest.spyOn(questionService, 'query').mockReturnValue(of(new HttpResponse({ body: questionCollection })));
      const additionalQuestions = [question];
      const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
      jest.spyOn(questionService, 'addQuestionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mCQOption });
      comp.ngOnInit();

      expect(questionService.query).toHaveBeenCalled();
      expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(
        questionCollection,
        ...additionalQuestions.map(expect.objectContaining)
      );
      expect(comp.questionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mCQOption: IMCQOption = { id: 456 };
      const question: IQuestion = { id: 14081 };
      mCQOption.question = question;

      activatedRoute.data = of({ mCQOption });
      comp.ngOnInit();

      expect(comp.questionsSharedCollection).toContain(question);
      expect(comp.mCQOption).toEqual(mCQOption);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMCQOption>>();
      const mCQOption = { id: 123 };
      jest.spyOn(mCQOptionFormService, 'getMCQOption').mockReturnValue(mCQOption);
      jest.spyOn(mCQOptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mCQOption });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mCQOption }));
      saveSubject.complete();

      // THEN
      expect(mCQOptionFormService.getMCQOption).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mCQOptionService.update).toHaveBeenCalledWith(expect.objectContaining(mCQOption));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMCQOption>>();
      const mCQOption = { id: 123 };
      jest.spyOn(mCQOptionFormService, 'getMCQOption').mockReturnValue({ id: null });
      jest.spyOn(mCQOptionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mCQOption: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mCQOption }));
      saveSubject.complete();

      // THEN
      expect(mCQOptionFormService.getMCQOption).toHaveBeenCalled();
      expect(mCQOptionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMCQOption>>();
      const mCQOption = { id: 123 };
      jest.spyOn(mCQOptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mCQOption });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mCQOptionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareQuestion', () => {
      it('Should forward to questionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(questionService, 'compareQuestion');
        comp.compareQuestion(entity, entity2);
        expect(questionService.compareQuestion).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
