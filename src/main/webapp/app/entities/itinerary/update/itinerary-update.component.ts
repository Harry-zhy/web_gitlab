import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ItineraryFormService, ItineraryFormGroup } from './itinerary-form.service';
import { IItinerary } from '../itinerary.model';
import { ItineraryService } from '../service/itinerary.service';

@Component({
  selector: 'jhi-itinerary-update',
  templateUrl: './itinerary-update.component.html',
})
export class ItineraryUpdateComponent implements OnInit {
  isSaving = false;
  itinerary: IItinerary | null = null;

  editForm: ItineraryFormGroup = this.itineraryFormService.createItineraryFormGroup();

  constructor(
    protected itineraryService: ItineraryService,
    protected itineraryFormService: ItineraryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itinerary }) => {
      this.itinerary = itinerary;
      if (itinerary) {
        this.updateForm(itinerary);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itinerary = this.itineraryFormService.getItinerary(this.editForm);
    if (itinerary.id !== null) {
      this.subscribeToSaveResponse(this.itineraryService.update(itinerary));
    } else {
      this.subscribeToSaveResponse(this.itineraryService.create(itinerary));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItinerary>>): void {
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

  protected updateForm(itinerary: IItinerary): void {
    this.itinerary = itinerary;
    this.itineraryFormService.resetForm(this.editForm, itinerary);
  }
}
