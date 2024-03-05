import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ItineraryVenueFormService, ItineraryVenueFormGroup } from './itinerary-venue-form.service';
import { IItineraryVenue } from '../itinerary-venue.model';
import { ItineraryVenueService } from '../service/itinerary-venue.service';

@Component({
  selector: 'jhi-itinerary-venue-update',
  templateUrl: './itinerary-venue-update.component.html',
})
export class ItineraryVenueUpdateComponent implements OnInit {
  isSaving = false;
  itineraryVenue: IItineraryVenue | null = null;

  editForm: ItineraryVenueFormGroup = this.itineraryVenueFormService.createItineraryVenueFormGroup();

  constructor(
    protected itineraryVenueService: ItineraryVenueService,
    protected itineraryVenueFormService: ItineraryVenueFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryVenue }) => {
      this.itineraryVenue = itineraryVenue;
      if (itineraryVenue) {
        this.updateForm(itineraryVenue);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itineraryVenue = this.itineraryVenueFormService.getItineraryVenue(this.editForm);
    if (itineraryVenue.id !== null) {
      this.subscribeToSaveResponse(this.itineraryVenueService.update(itineraryVenue));
    } else {
      this.subscribeToSaveResponse(this.itineraryVenueService.create(itineraryVenue));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItineraryVenue>>): void {
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

  protected updateForm(itineraryVenue: IItineraryVenue): void {
    this.itineraryVenue = itineraryVenue;
    this.itineraryVenueFormService.resetForm(this.editForm, itineraryVenue);
  }
}
