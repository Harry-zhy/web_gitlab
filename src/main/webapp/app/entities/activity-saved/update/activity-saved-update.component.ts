import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActivitySavedFormService, ActivitySavedFormGroup } from './activity-saved-form.service';
import { IActivitySaved } from '../activity-saved.model';
import { ActivitySavedService } from '../service/activity-saved.service';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { EventItineraryService } from 'app/entities/event-itinerary/service/event-itinerary.service';

@Component({
  selector: 'jhi-activity-saved-update',
  templateUrl: './activity-saved-update.component.html',
})
export class ActivitySavedUpdateComponent implements OnInit {
  isSaving = false;
  activitySaved: IActivitySaved | null = null;

  eventItinerariesSharedCollection: IEventItinerary[] = [];

  editForm: ActivitySavedFormGroup = this.activitySavedFormService.createActivitySavedFormGroup();

  constructor(
    protected activitySavedService: ActivitySavedService,
    protected activitySavedFormService: ActivitySavedFormService,
    protected eventItineraryService: EventItineraryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEventItinerary = (o1: IEventItinerary | null, o2: IEventItinerary | null): boolean =>
    this.eventItineraryService.compareEventItinerary(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activitySaved }) => {
      this.activitySaved = activitySaved;
      if (activitySaved) {
        this.updateForm(activitySaved);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activitySaved = this.activitySavedFormService.getActivitySaved(this.editForm);
    if (activitySaved.id !== null) {
      this.subscribeToSaveResponse(this.activitySavedService.update(activitySaved));
    } else {
      this.subscribeToSaveResponse(this.activitySavedService.create(activitySaved));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivitySaved>>): void {
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

  protected updateForm(activitySaved: IActivitySaved): void {
    this.activitySaved = activitySaved;
    this.activitySavedFormService.resetForm(this.editForm, activitySaved);

    this.eventItinerariesSharedCollection = this.eventItineraryService.addEventItineraryToCollectionIfMissing<IEventItinerary>(
      this.eventItinerariesSharedCollection,
      activitySaved.eventItinerary
    );
  }

  protected loadRelationshipsOptions(): void {
    this.eventItineraryService
      .query()
      .pipe(map((res: HttpResponse<IEventItinerary[]>) => res.body ?? []))
      .pipe(
        map((eventItineraries: IEventItinerary[]) =>
          this.eventItineraryService.addEventItineraryToCollectionIfMissing<IEventItinerary>(
            eventItineraries,
            this.activitySaved?.eventItinerary
          )
        )
      )
      .subscribe((eventItineraries: IEventItinerary[]) => (this.eventItinerariesSharedCollection = eventItineraries));
  }
}
