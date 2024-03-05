import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActivitySelfFormService, ActivitySelfFormGroup } from './activity-self-form.service';
import { IActivitySelf } from '../activity-self.model';
import { ActivitySelfService } from '../service/activity-self.service';
import { IActivitySaved } from 'app/entities/activity-saved/activity-saved.model';
import { ActivitySavedService } from 'app/entities/activity-saved/service/activity-saved.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

@Component({
  selector: 'jhi-activity-self-update',
  templateUrl: './activity-self-update.component.html',
})
export class ActivitySelfUpdateComponent implements OnInit {
  isSaving = false;
  activitySelf: IActivitySelf | null = null;

  activitySavedsSharedCollection: IActivitySaved[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm: ActivitySelfFormGroup = this.activitySelfFormService.createActivitySelfFormGroup();

  constructor(
    protected activitySelfService: ActivitySelfService,
    protected activitySelfFormService: ActivitySelfFormService,
    protected activitySavedService: ActivitySavedService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareActivitySaved = (o1: IActivitySaved | null, o2: IActivitySaved | null): boolean =>
    this.activitySavedService.compareActivitySaved(o1, o2);

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activitySelf }) => {
      this.activitySelf = activitySelf;
      if (activitySelf) {
        this.updateForm(activitySelf);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activitySelf = this.activitySelfFormService.getActivitySelf(this.editForm);
    if (activitySelf.id !== null) {
      this.subscribeToSaveResponse(this.activitySelfService.update(activitySelf));
    } else {
      this.subscribeToSaveResponse(this.activitySelfService.create(activitySelf));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivitySelf>>): void {
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

  protected updateForm(activitySelf: IActivitySelf): void {
    this.activitySelf = activitySelf;
    this.activitySelfFormService.resetForm(this.editForm, activitySelf);

    this.activitySavedsSharedCollection = this.activitySavedService.addActivitySavedToCollectionIfMissing<IActivitySaved>(
      this.activitySavedsSharedCollection,
      ...(activitySelf.activitySaveds ?? [])
    );
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing<IEvent>(this.eventsSharedCollection, activitySelf.event);
  }

  protected loadRelationshipsOptions(): void {
    this.activitySavedService
      .query()
      .pipe(map((res: HttpResponse<IActivitySaved[]>) => res.body ?? []))
      .pipe(
        map((activitySaveds: IActivitySaved[]) =>
          this.activitySavedService.addActivitySavedToCollectionIfMissing<IActivitySaved>(
            activitySaveds,
            ...(this.activitySelf?.activitySaveds ?? [])
          )
        )
      )
      .subscribe((activitySaveds: IActivitySaved[]) => (this.activitySavedsSharedCollection = activitySaveds));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing<IEvent>(events, this.activitySelf?.event)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));
  }
}
