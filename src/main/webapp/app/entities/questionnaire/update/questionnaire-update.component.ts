import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { QuestionnaireFormService, QuestionnaireFormGroup } from './questionnaire-form.service';
import { IQuestionnaire } from '../questionnaire.model';
import { QuestionnaireService } from '../service/questionnaire.service';
import { IIntro } from 'app/entities/intro/intro.model';
import { IntroService } from 'app/entities/intro/service/intro.service';

@Component({
  selector: 'jhi-questionnaire-update',
  templateUrl: './questionnaire-update.component.html',
})
export class QuestionnaireUpdateComponent implements OnInit {
  isSaving = false;
  questionnaire: IQuestionnaire | null = null;

  introsSharedCollection: IIntro[] = [];

  editForm: QuestionnaireFormGroup = this.questionnaireFormService.createQuestionnaireFormGroup();

  constructor(
    protected questionnaireService: QuestionnaireService,
    protected questionnaireFormService: QuestionnaireFormService,
    protected introService: IntroService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareIntro = (o1: IIntro | null, o2: IIntro | null): boolean => this.introService.compareIntro(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionnaire }) => {
      this.questionnaire = questionnaire;
      if (questionnaire) {
        this.updateForm(questionnaire);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const questionnaire = this.questionnaireFormService.getQuestionnaire(this.editForm);
    if (questionnaire.id !== null) {
      this.subscribeToSaveResponse(this.questionnaireService.update(questionnaire));
    } else {
      this.subscribeToSaveResponse(this.questionnaireService.create(questionnaire));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionnaire>>): void {
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

  protected updateForm(questionnaire: IQuestionnaire): void {
    this.questionnaire = questionnaire;
    this.questionnaireFormService.resetForm(this.editForm, questionnaire);

    this.introsSharedCollection = this.introService.addIntroToCollectionIfMissing<IIntro>(
      this.introsSharedCollection,
      questionnaire.questionnaire
    );
  }

  protected loadRelationshipsOptions(): void {
    this.introService
      .query()
      .pipe(map((res: HttpResponse<IIntro[]>) => res.body ?? []))
      .pipe(map((intros: IIntro[]) => this.introService.addIntroToCollectionIfMissing<IIntro>(intros, this.questionnaire?.questionnaire)))
      .subscribe((intros: IIntro[]) => (this.introsSharedCollection = intros));
  }
}
