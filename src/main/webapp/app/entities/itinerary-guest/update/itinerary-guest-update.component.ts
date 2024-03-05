import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItineraryGuestFormService, ItineraryGuestFormGroup } from './itinerary-guest-form.service';
import { IItineraryGuest } from '../itinerary-guest.model';
import { ItineraryGuestService } from '../service/itinerary-guest.service';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { EventItineraryService } from 'app/entities/event-itinerary/service/event-itinerary.service';

@Component({
  selector: 'jhi-itinerary-guest-update',
  templateUrl: './itinerary-guest-update.component.html',
})
export class ItineraryGuestUpdateComponent implements OnInit {
  isSaving = false;
  itineraryGuest: IItineraryGuest | null = null;

  eventItinerariesSharedCollection: IEventItinerary[] = [];

  editForm: ItineraryGuestFormGroup = this.itineraryGuestFormService.createItineraryGuestFormGroup();

  constructor(
    protected itineraryGuestService: ItineraryGuestService,
    protected itineraryGuestFormService: ItineraryGuestFormService,
    protected eventItineraryService: EventItineraryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEventItinerary = (o1: IEventItinerary | null, o2: IEventItinerary | null): boolean =>
    this.eventItineraryService.compareEventItinerary(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryGuest }) => {
      this.itineraryGuest = itineraryGuest;
      if (itineraryGuest) {
        this.updateForm(itineraryGuest);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itineraryGuest = this.itineraryGuestFormService.getItineraryGuest(this.editForm);
    if (itineraryGuest.id !== null) {
      this.subscribeToSaveResponse(this.itineraryGuestService.update(itineraryGuest));
    } else {
      this.subscribeToSaveResponse(this.itineraryGuestService.create(itineraryGuest));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItineraryGuest>>): void {
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

  protected updateForm(itineraryGuest: IItineraryGuest): void {
    this.itineraryGuest = itineraryGuest;
    this.itineraryGuestFormService.resetForm(this.editForm, itineraryGuest);

    this.eventItinerariesSharedCollection = this.eventItineraryService.addEventItineraryToCollectionIfMissing<IEventItinerary>(
      this.eventItinerariesSharedCollection,
      ...(itineraryGuest.eventItineraries ?? [])
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
            ...(this.itineraryGuest?.eventItineraries ?? [])
          )
        )
      )
      .subscribe((eventItineraries: IEventItinerary[]) => (this.eventItinerariesSharedCollection = eventItineraries));
  }
}
