import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RatingFormService, RatingFormGroup } from './rating-form.service';
import { IRating } from '../rating.model';
import { RatingService } from '../service/rating.service';
import { ICaterers } from 'app/entities/caterers/caterers.model';
import { CaterersService } from 'app/entities/caterers/service/caterers.service';
import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { ActivityCompanyService } from 'app/entities/activity-company/service/activity-company.service';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';
import { BookedActivityService } from 'app/entities/booked-activity/service/booked-activity.service';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { ActivitySelfService } from 'app/entities/activity-self/service/activity-self.service';

@Component({
  selector: 'jhi-rating-update',
  templateUrl: './rating-update.component.html',
})
export class RatingUpdateComponent implements OnInit {
  isSaving = false;
  rating: IRating | null = null;

  caterersSharedCollection: ICaterers[] = [];
  activityCompaniesSharedCollection: IActivityCompany[] = [];
  bookedActivitiesSharedCollection: IBookedActivity[] = [];
  activitySelvesSharedCollection: IActivitySelf[] = [];

  editForm: RatingFormGroup = this.ratingFormService.createRatingFormGroup();

  constructor(
    protected ratingService: RatingService,
    protected ratingFormService: RatingFormService,
    protected caterersService: CaterersService,
    protected activityCompanyService: ActivityCompanyService,
    protected bookedActivityService: BookedActivityService,
    protected activitySelfService: ActivitySelfService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCaterers = (o1: ICaterers | null, o2: ICaterers | null): boolean => this.caterersService.compareCaterers(o1, o2);

  compareActivityCompany = (o1: IActivityCompany | null, o2: IActivityCompany | null): boolean =>
    this.activityCompanyService.compareActivityCompany(o1, o2);

  compareBookedActivity = (o1: IBookedActivity | null, o2: IBookedActivity | null): boolean =>
    this.bookedActivityService.compareBookedActivity(o1, o2);

  compareActivitySelf = (o1: IActivitySelf | null, o2: IActivitySelf | null): boolean =>
    this.activitySelfService.compareActivitySelf(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rating }) => {
      this.rating = rating;
      if (rating) {
        this.updateForm(rating);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rating = this.ratingFormService.getRating(this.editForm);
    if (rating.id !== null) {
      this.subscribeToSaveResponse(this.ratingService.update(rating));
    } else {
      this.subscribeToSaveResponse(this.ratingService.create(rating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRating>>): void {
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

  protected updateForm(rating: IRating): void {
    this.rating = rating;
    this.ratingFormService.resetForm(this.editForm, rating);

    this.caterersSharedCollection = this.caterersService.addCaterersToCollectionIfMissing<ICaterers>(
      this.caterersSharedCollection,
      rating.caterers
    );
    this.activityCompaniesSharedCollection = this.activityCompanyService.addActivityCompanyToCollectionIfMissing<IActivityCompany>(
      this.activityCompaniesSharedCollection,
      rating.activityCompany
    );
    this.bookedActivitiesSharedCollection = this.bookedActivityService.addBookedActivityToCollectionIfMissing<IBookedActivity>(
      this.bookedActivitiesSharedCollection,
      rating.bookedActivity
    );
    this.activitySelvesSharedCollection = this.activitySelfService.addActivitySelfToCollectionIfMissing<IActivitySelf>(
      this.activitySelvesSharedCollection,
      rating.activitySelf
    );
  }

  protected loadRelationshipsOptions(): void {
    this.caterersService
      .query()
      .pipe(map((res: HttpResponse<ICaterers[]>) => res.body ?? []))
      .pipe(
        map((caterers: ICaterers[]) => this.caterersService.addCaterersToCollectionIfMissing<ICaterers>(caterers, this.rating?.caterers))
      )
      .subscribe((caterers: ICaterers[]) => (this.caterersSharedCollection = caterers));

    this.activityCompanyService
      .query()
      .pipe(map((res: HttpResponse<IActivityCompany[]>) => res.body ?? []))
      .pipe(
        map((activityCompanies: IActivityCompany[]) =>
          this.activityCompanyService.addActivityCompanyToCollectionIfMissing<IActivityCompany>(
            activityCompanies,
            this.rating?.activityCompany
          )
        )
      )
      .subscribe((activityCompanies: IActivityCompany[]) => (this.activityCompaniesSharedCollection = activityCompanies));

    this.bookedActivityService
      .query()
      .pipe(map((res: HttpResponse<IBookedActivity[]>) => res.body ?? []))
      .pipe(
        map((bookedActivities: IBookedActivity[]) =>
          this.bookedActivityService.addBookedActivityToCollectionIfMissing<IBookedActivity>(bookedActivities, this.rating?.bookedActivity)
        )
      )
      .subscribe((bookedActivities: IBookedActivity[]) => (this.bookedActivitiesSharedCollection = bookedActivities));

    this.activitySelfService
      .query()
      .pipe(map((res: HttpResponse<IActivitySelf[]>) => res.body ?? []))
      .pipe(
        map((activitySelves: IActivitySelf[]) =>
          this.activitySelfService.addActivitySelfToCollectionIfMissing<IActivitySelf>(activitySelves, this.rating?.activitySelf)
        )
      )
      .subscribe((activitySelves: IActivitySelf[]) => (this.activitySelvesSharedCollection = activitySelves));
  }
}
