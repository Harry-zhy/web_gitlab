import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ItineraryActivityFormService, ItineraryActivityFormGroup } from './itinerary-activity-form.service';
import { IItineraryActivity } from '../itinerary-activity.model';
import { ItineraryActivityService } from '../service/itinerary-activity.service';

@Component({
  selector: 'jhi-itinerary-activity-update',
  templateUrl: './itinerary-activity-update.component.html',
})
export class ItineraryActivityUpdateComponent implements OnInit {
  isSaving = false;
  itineraryActivity: IItineraryActivity | null = null;

  editForm: ItineraryActivityFormGroup = this.itineraryActivityFormService.createItineraryActivityFormGroup();

  constructor(
    protected itineraryActivityService: ItineraryActivityService,
    protected itineraryActivityFormService: ItineraryActivityFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryActivity }) => {
      this.itineraryActivity = itineraryActivity;
      if (itineraryActivity) {
        this.updateForm(itineraryActivity);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itineraryActivity = this.itineraryActivityFormService.getItineraryActivity(this.editForm);
    if (itineraryActivity.id !== null) {
      this.subscribeToSaveResponse(this.itineraryActivityService.update(itineraryActivity));
    } else {
      this.subscribeToSaveResponse(this.itineraryActivityService.create(itineraryActivity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItineraryActivity>>): void {
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

  protected updateForm(itineraryActivity: IItineraryActivity): void {
    this.itineraryActivity = itineraryActivity;
    this.itineraryActivityFormService.resetForm(this.editForm, itineraryActivity);
  }
}
