import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { QuestionFormService, QuestionFormGroup } from './question-form.service';
import { IQuestion } from '../question.model';
import { QuestionService } from '../service/question.service';
import { IQuestionnaire } from 'app/entities/questionnaire/questionnaire.model';
import { QuestionnaireService } from 'app/entities/questionnaire/service/questionnaire.service';
import { QuesType } from 'app/entities/enumerations/ques-type.model';

@Component({
  selector: 'jhi-question-update',
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  isSaving = false;
  question: IQuestion | null = null;
  quesTypeValues = Object.keys(QuesType);

  questionsSharedCollection: IQuestion[] = [];
  questionnairesSharedCollection: IQuestionnaire[] = [];

  editForm: QuestionFormGroup = this.questionFormService.createQuestionFormGroup();

  constructor(
    protected questionService: QuestionService,
    protected questionFormService: QuestionFormService,
    protected questionnaireService: QuestionnaireService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareQuestion = (o1: IQuestion | null, o2: IQuestion | null): boolean => this.questionService.compareQuestion(o1, o2);

  compareQuestionnaire = (o1: IQuestionnaire | null, o2: IQuestionnaire | null): boolean =>
    this.questionnaireService.compareQuestionnaire(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ question }) => {
      this.question = question;
      if (question) {
        this.updateForm(question);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const question = this.questionFormService.getQuestion(this.editForm);
    if (question.id !== null) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(question: IQuestion): void {
    this.question = question;
    this.questionFormService.resetForm(this.editForm, question);

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing<IQuestion>(
      this.questionsSharedCollection,
      question.subQues
    );
    this.questionnairesSharedCollection = this.questionnaireService.addQuestionnaireToCollectionIfMissing<IQuestionnaire>(
      this.questionnairesSharedCollection,
      question.questionnaire
    );
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) => this.questionService.addQuestionToCollectionIfMissing<IQuestion>(questions, this.question?.subQues))
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));

    this.questionnaireService
      .query()
      .pipe(map((res: HttpResponse<IQuestionnaire[]>) => res.body ?? []))
      .pipe(
        map((questionnaires: IQuestionnaire[]) =>
          this.questionnaireService.addQuestionnaireToCollectionIfMissing<IQuestionnaire>(questionnaires, this.question?.questionnaire)
        )
      )
      .subscribe((questionnaires: IQuestionnaire[]) => (this.questionnairesSharedCollection = questionnaires));
  }
}
