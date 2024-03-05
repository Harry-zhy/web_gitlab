import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MCQOptionFormService, MCQOptionFormGroup } from './mcq-option-form.service';
import { IMCQOption } from '../mcq-option.model';
import { MCQOptionService } from '../service/mcq-option.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

@Component({
  selector: 'jhi-mcq-option-update',
  templateUrl: './mcq-option-update.component.html',
})
export class MCQOptionUpdateComponent implements OnInit {
  isSaving = false;
  mCQOption: IMCQOption | null = null;

  questionsSharedCollection: IQuestion[] = [];

  editForm: MCQOptionFormGroup = this.mCQOptionFormService.createMCQOptionFormGroup();

  constructor(
    protected mCQOptionService: MCQOptionService,
    protected mCQOptionFormService: MCQOptionFormService,
    protected questionService: QuestionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareQuestion = (o1: IQuestion | null, o2: IQuestion | null): boolean => this.questionService.compareQuestion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mCQOption }) => {
      this.mCQOption = mCQOption;
      if (mCQOption) {
        this.updateForm(mCQOption);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mCQOption = this.mCQOptionFormService.getMCQOption(this.editForm);
    if (mCQOption.id !== null) {
      this.subscribeToSaveResponse(this.mCQOptionService.update(mCQOption));
    } else {
      this.subscribeToSaveResponse(this.mCQOptionService.create(mCQOption));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMCQOption>>): void {
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

  protected updateForm(mCQOption: IMCQOption): void {
    this.mCQOption = mCQOption;
    this.mCQOptionFormService.resetForm(this.editForm, mCQOption);

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing<IQuestion>(
      this.questionsSharedCollection,
      mCQOption.question
    );
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing<IQuestion>(questions, this.mCQOption?.question)
        )
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));
  }
}
