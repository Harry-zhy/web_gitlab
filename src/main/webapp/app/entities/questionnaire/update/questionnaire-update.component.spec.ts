import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { QuestionnaireFormService } from './questionnaire-form.service';
import { QuestionnaireService } from '../service/questionnaire.service';
import { IQuestionnaire } from '../questionnaire.model';
import { IIntro } from 'app/entities/intro/intro.model';
import { IntroService } from 'app/entities/intro/service/intro.service';

import { QuestionnaireUpdateComponent } from './questionnaire-update.component';

describe('Questionnaire Management Update Component', () => {
  let comp: QuestionnaireUpdateComponent;
  let fixture: ComponentFixture<QuestionnaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let questionnaireFormService: QuestionnaireFormService;
  let questionnaireService: QuestionnaireService;
  let introService: IntroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [QuestionnaireUpdateComponent],
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
      .overrideTemplate(QuestionnaireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    questionnaireFormService = TestBed.inject(QuestionnaireFormService);
    questionnaireService = TestBed.inject(QuestionnaireService);
    introService = TestBed.inject(IntroService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Intro query and add missing value', () => {
      const questionnaire: IQuestionnaire = { id: 456 };
      const questionnaire: IIntro = { id: 33321 };
      questionnaire.questionnaire = questionnaire;

      const introCollection: IIntro[] = [{ id: 46734 }];
      jest.spyOn(introService, 'query').mockReturnValue(of(new HttpResponse({ body: introCollection })));
      const additionalIntros = [questionnaire];
      const expectedCollection: IIntro[] = [...additionalIntros, ...introCollection];
      jest.spyOn(introService, 'addIntroToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ questionnaire });
      comp.ngOnInit();

      expect(introService.query).toHaveBeenCalled();
      expect(introService.addIntroToCollectionIfMissing).toHaveBeenCalledWith(
        introCollection,
        ...additionalIntros.map(expect.objectContaining)
      );
      expect(comp.introsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const questionnaire: IQuestionnaire = { id: 456 };
      const questionnaire: IIntro = { id: 43081 };
      questionnaire.questionnaire = questionnaire;

      activatedRoute.data = of({ questionnaire });
      comp.ngOnInit();

      expect(comp.introsSharedCollection).toContain(questionnaire);
      expect(comp.questionnaire).toEqual(questionnaire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuestionnaire>>();
      const questionnaire = { id: 123 };
      jest.spyOn(questionnaireFormService, 'getQuestionnaire').mockReturnValue(questionnaire);
      jest.spyOn(questionnaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionnaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: questionnaire }));
      saveSubject.complete();

      // THEN
      expect(questionnaireFormService.getQuestionnaire).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(questionnaireService.update).toHaveBeenCalledWith(expect.objectContaining(questionnaire));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuestionnaire>>();
      const questionnaire = { id: 123 };
      jest.spyOn(questionnaireFormService, 'getQuestionnaire').mockReturnValue({ id: null });
      jest.spyOn(questionnaireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionnaire: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: questionnaire }));
      saveSubject.complete();

      // THEN
      expect(questionnaireFormService.getQuestionnaire).toHaveBeenCalled();
      expect(questionnaireService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuestionnaire>>();
      const questionnaire = { id: 123 };
      jest.spyOn(questionnaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionnaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(questionnaireService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareIntro', () => {
      it('Should forward to introService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(introService, 'compareIntro');
        comp.compareIntro(entity, entity2);
        expect(introService.compareIntro).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
