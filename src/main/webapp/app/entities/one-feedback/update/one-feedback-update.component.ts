import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OneFeedbackFormService, OneFeedbackFormGroup } from './one-feedback-form.service';
import { IOneFeedback } from '../one-feedback.model';
import { OneFeedbackService } from '../service/one-feedback.service';
import { IFeedbacks } from 'app/entities/feedbacks/feedbacks.model';
import { FeedbacksService } from 'app/entities/feedbacks/service/feedbacks.service';

@Component({
  selector: 'jhi-one-feedback-update',
  templateUrl: './one-feedback-update.component.html',
})
export class OneFeedbackUpdateComponent implements OnInit {
  isSaving = false;
  oneFeedback: IOneFeedback | null = null;

  feedbacksSharedCollection: IFeedbacks[] = [];

  editForm: OneFeedbackFormGroup = this.oneFeedbackFormService.createOneFeedbackFormGroup();

  constructor(
    protected oneFeedbackService: OneFeedbackService,
    protected oneFeedbackFormService: OneFeedbackFormService,
    protected feedbacksService: FeedbacksService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFeedbacks = (o1: IFeedbacks | null, o2: IFeedbacks | null): boolean => this.feedbacksService.compareFeedbacks(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ oneFeedback }) => {
      this.oneFeedback = oneFeedback;
      if (oneFeedback) {
        this.updateForm(oneFeedback);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const oneFeedback = this.oneFeedbackFormService.getOneFeedback(this.editForm);
    if (oneFeedback.id !== null) {
      this.subscribeToSaveResponse(this.oneFeedbackService.update(oneFeedback));
    } else {
      this.subscribeToSaveResponse(this.oneFeedbackService.create(oneFeedback));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOneFeedback>>): void {
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

  protected updateForm(oneFeedback: IOneFeedback): void {
    this.oneFeedback = oneFeedback;
    this.oneFeedbackFormService.resetForm(this.editForm, oneFeedback);

    this.feedbacksSharedCollection = this.feedbacksService.addFeedbacksToCollectionIfMissing<IFeedbacks>(
      this.feedbacksSharedCollection,
      oneFeedback.feedbacks
    );
  }

  protected loadRelationshipsOptions(): void {
    this.feedbacksService
      .query()
      .pipe(map((res: HttpResponse<IFeedbacks[]>) => res.body ?? []))
      .pipe(
        map((feedbacks: IFeedbacks[]) =>
          this.feedbacksService.addFeedbacksToCollectionIfMissing<IFeedbacks>(feedbacks, this.oneFeedback?.feedbacks)
        )
      )
      .subscribe((feedbacks: IFeedbacks[]) => (this.feedbacksSharedCollection = feedbacks));
  }
}
