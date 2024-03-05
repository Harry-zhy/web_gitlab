import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EventItineraryFormService, EventItineraryFormGroup } from './event-itinerary-form.service';
import { IEventItinerary } from '../event-itinerary.model';
import { EventItineraryService } from '../service/event-itinerary.service';
import { IItineraryDateTime } from 'app/entities/itinerary-date-time/itinerary-date-time.model';
import { ItineraryDateTimeService } from 'app/entities/itinerary-date-time/service/itinerary-date-time.service';

@Component({
  selector: 'jhi-event-itinerary-update',
  templateUrl: './event-itinerary-update.component.html',
})
export class EventItineraryUpdateComponent implements OnInit {
  isSaving = false;
  eventItinerary: IEventItinerary | null = null;

  itineraryDateTimesSharedCollection: IItineraryDateTime[] = [];

  editForm: EventItineraryFormGroup = this.eventItineraryFormService.createEventItineraryFormGroup();

  constructor(
    protected eventItineraryService: EventItineraryService,
    protected eventItineraryFormService: EventItineraryFormService,
    protected itineraryDateTimeService: ItineraryDateTimeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareItineraryDateTime = (o1: IItineraryDateTime | null, o2: IItineraryDateTime | null): boolean =>
    this.itineraryDateTimeService.compareItineraryDateTime(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventItinerary }) => {
      this.eventItinerary = eventItinerary;
      if (eventItinerary) {
        this.updateForm(eventItinerary);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventItinerary = this.eventItineraryFormService.getEventItinerary(this.editForm);
    if (eventItinerary.id !== null) {
      this.subscribeToSaveResponse(this.eventItineraryService.update(eventItinerary));
    } else {
      this.subscribeToSaveResponse(this.eventItineraryService.create(eventItinerary));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventItinerary>>): void {
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

  protected updateForm(eventItinerary: IEventItinerary): void {
    this.eventItinerary = eventItinerary;
    this.eventItineraryFormService.resetForm(this.editForm, eventItinerary);

    this.itineraryDateTimesSharedCollection = this.itineraryDateTimeService.addItineraryDateTimeToCollectionIfMissing<IItineraryDateTime>(
      this.itineraryDateTimesSharedCollection,
      eventItinerary.eventDate
    );
  }

  protected loadRelationshipsOptions(): void {
    this.itineraryDateTimeService
      .query()
      .pipe(map((res: HttpResponse<IItineraryDateTime[]>) => res.body ?? []))
      .pipe(
        map((itineraryDateTimes: IItineraryDateTime[]) =>
          this.itineraryDateTimeService.addItineraryDateTimeToCollectionIfMissing<IItineraryDateTime>(
            itineraryDateTimes,
            this.eventItinerary?.eventDate
          )
        )
      )
      .subscribe((itineraryDateTimes: IItineraryDateTime[]) => (this.itineraryDateTimesSharedCollection = itineraryDateTimes));
  }
}
