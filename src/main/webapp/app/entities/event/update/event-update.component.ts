import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EventFormService, EventFormGroup } from './event-form.service';
import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';
import { IMockVenueEntity } from 'app/entities/mock-venue-entity/mock-venue-entity.model';
import { MockVenueEntityService } from 'app/entities/mock-venue-entity/service/mock-venue-entity.service';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;
  event: IEvent | null = null;

  mockVenueEntitiesSharedCollection: IMockVenueEntity[] = [];

  editForm: EventFormGroup = this.eventFormService.createEventFormGroup();

  constructor(
    protected eventService: EventService,
    protected eventFormService: EventFormService,
    protected mockVenueEntityService: MockVenueEntityService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMockVenueEntity = (o1: IMockVenueEntity | null, o2: IMockVenueEntity | null): boolean =>
    this.mockVenueEntityService.compareMockVenueEntity(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
      if (event) {
        this.updateForm(event);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.eventFormService.getEvent(this.editForm);
    if (event.id !== null) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
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

  protected updateForm(event: IEvent): void {
    this.event = event;
    this.eventFormService.resetForm(this.editForm, event);

    this.mockVenueEntitiesSharedCollection = this.mockVenueEntityService.addMockVenueEntityToCollectionIfMissing<IMockVenueEntity>(
      this.mockVenueEntitiesSharedCollection,
      event.venue
    );
  }

  protected loadRelationshipsOptions(): void {
    this.mockVenueEntityService
      .query()
      .pipe(map((res: HttpResponse<IMockVenueEntity[]>) => res.body ?? []))
      .pipe(
        map((mockVenueEntities: IMockVenueEntity[]) =>
          this.mockVenueEntityService.addMockVenueEntityToCollectionIfMissing<IMockVenueEntity>(mockVenueEntities, this.event?.venue)
        )
      )
      .subscribe((mockVenueEntities: IMockVenueEntity[]) => (this.mockVenueEntitiesSharedCollection = mockVenueEntities));
  }
}
