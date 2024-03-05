import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ItineraryDateTimeFormService, ItineraryDateTimeFormGroup } from './itinerary-date-time-form.service';
import { IItineraryDateTime } from '../itinerary-date-time.model';
import { ItineraryDateTimeService } from '../service/itinerary-date-time.service';

@Component({
  selector: 'jhi-itinerary-date-time-update',
  templateUrl: './itinerary-date-time-update.component.html',
})
export class ItineraryDateTimeUpdateComponent implements OnInit {
  isSaving = false;
  itineraryDateTime: IItineraryDateTime | null = null;

  editForm: ItineraryDateTimeFormGroup = this.itineraryDateTimeFormService.createItineraryDateTimeFormGroup();

  constructor(
    protected itineraryDateTimeService: ItineraryDateTimeService,
    protected itineraryDateTimeFormService: ItineraryDateTimeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryDateTime }) => {
      this.itineraryDateTime = itineraryDateTime;
      if (itineraryDateTime) {
        this.updateForm(itineraryDateTime);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itineraryDateTime = this.itineraryDateTimeFormService.getItineraryDateTime(this.editForm);
    if (itineraryDateTime.id !== null) {
      this.subscribeToSaveResponse(this.itineraryDateTimeService.update(itineraryDateTime));
    } else {
      this.subscribeToSaveResponse(this.itineraryDateTimeService.create(itineraryDateTime));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItineraryDateTime>>): void {
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

  protected updateForm(itineraryDateTime: IItineraryDateTime): void {
    this.itineraryDateTime = itineraryDateTime;
    this.itineraryDateTimeFormService.resetForm(this.editForm, itineraryDateTime);
  }
}
