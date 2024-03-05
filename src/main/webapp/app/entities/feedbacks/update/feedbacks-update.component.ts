import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FeedbacksFormService, FeedbacksFormGroup } from './feedbacks-form.service';
import { IFeedbacks } from '../feedbacks.model';
import { FeedbacksService } from '../service/feedbacks.service';
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

@Component({
  selector: 'jhi-feedbacks-update',
  templateUrl: './feedbacks-update.component.html',
})
export class FeedbacksUpdateComponent implements OnInit {
  isSaving = false;
  feedbacks: IFeedbacks | null = null;

  ratingsSharedCollection: IRating[] = [];
  suppliersSharedCollection: ISupplier[] = [];

  editForm: FeedbacksFormGroup = this.feedbacksFormService.createFeedbacksFormGroup();

  constructor(
    protected feedbacksService: FeedbacksService,
    protected feedbacksFormService: FeedbacksFormService,
    protected ratingService: RatingService,
    protected supplierService: SupplierService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRating = (o1: IRating | null, o2: IRating | null): boolean => this.ratingService.compareRating(o1, o2);

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feedbacks }) => {
      this.feedbacks = feedbacks;
      if (feedbacks) {
        this.updateForm(feedbacks);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const feedbacks = this.feedbacksFormService.getFeedbacks(this.editForm);
    if (feedbacks.id !== null) {
      this.subscribeToSaveResponse(this.feedbacksService.update(feedbacks));
    } else {
      this.subscribeToSaveResponse(this.feedbacksService.create(feedbacks));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFeedbacks>>): void {
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

  protected updateForm(feedbacks: IFeedbacks): void {
    this.feedbacks = feedbacks;
    this.feedbacksFormService.resetForm(this.editForm, feedbacks);

    this.ratingsSharedCollection = this.ratingService.addRatingToCollectionIfMissing<IRating>(
      this.ratingsSharedCollection,
      feedbacks.rating
    );
    this.suppliersSharedCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersSharedCollection,
      feedbacks.supplier
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ratingService
      .query()
      .pipe(map((res: HttpResponse<IRating[]>) => res.body ?? []))
      .pipe(map((ratings: IRating[]) => this.ratingService.addRatingToCollectionIfMissing<IRating>(ratings, this.feedbacks?.rating)))
      .subscribe((ratings: IRating[]) => (this.ratingsSharedCollection = ratings));

    this.supplierService
      .query()
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.feedbacks?.supplier)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersSharedCollection = suppliers));
  }
}
