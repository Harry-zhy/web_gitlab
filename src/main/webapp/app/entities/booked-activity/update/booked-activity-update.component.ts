import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BookedActivityFormService, BookedActivityFormGroup } from './booked-activity-form.service';
import { IBookedActivity } from '../booked-activity.model';
import { BookedActivityService } from '../service/booked-activity.service';
import { IActivitySaved } from 'app/entities/activity-saved/activity-saved.model';
import { ActivitySavedService } from 'app/entities/activity-saved/service/activity-saved.service';

@Component({
  selector: 'jhi-booked-activity-update',
  templateUrl: './booked-activity-update.component.html',
})
export class BookedActivityUpdateComponent implements OnInit {
  isSaving = false;
  bookedActivity: IBookedActivity | null = null;

  activitySavedsSharedCollection: IActivitySaved[] = [];

  editForm: BookedActivityFormGroup = this.bookedActivityFormService.createBookedActivityFormGroup();

  constructor(
    protected bookedActivityService: BookedActivityService,
    protected bookedActivityFormService: BookedActivityFormService,
    protected activitySavedService: ActivitySavedService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareActivitySaved = (o1: IActivitySaved | null, o2: IActivitySaved | null): boolean =>
    this.activitySavedService.compareActivitySaved(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookedActivity }) => {
      this.bookedActivity = bookedActivity;
      if (bookedActivity) {
        this.updateForm(bookedActivity);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookedActivity = this.bookedActivityFormService.getBookedActivity(this.editForm);
    if (bookedActivity.id !== null) {
      this.subscribeToSaveResponse(this.bookedActivityService.update(bookedActivity));
    } else {
      this.subscribeToSaveResponse(this.bookedActivityService.create(bookedActivity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookedActivity>>): void {
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

  protected updateForm(bookedActivity: IBookedActivity): void {
    this.bookedActivity = bookedActivity;
    this.bookedActivityFormService.resetForm(this.editForm, bookedActivity);

    this.activitySavedsSharedCollection = this.activitySavedService.addActivitySavedToCollectionIfMissing<IActivitySaved>(
      this.activitySavedsSharedCollection,
      ...(bookedActivity.activitySaveds ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.activitySavedService
      .query()
      .pipe(map((res: HttpResponse<IActivitySaved[]>) => res.body ?? []))
      .pipe(
        map((activitySaveds: IActivitySaved[]) =>
          this.activitySavedService.addActivitySavedToCollectionIfMissing<IActivitySaved>(
            activitySaveds,
            ...(this.bookedActivity?.activitySaveds ?? [])
          )
        )
      )
      .subscribe((activitySaveds: IActivitySaved[]) => (this.activitySavedsSharedCollection = activitySaveds));
  }
}
