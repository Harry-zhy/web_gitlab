import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ItineraryCatererFormService, ItineraryCatererFormGroup } from './itinerary-caterer-form.service';
import { IItineraryCaterer } from '../itinerary-caterer.model';
import { ItineraryCatererService } from '../service/itinerary-caterer.service';

@Component({
  selector: 'jhi-itinerary-caterer-update',
  templateUrl: './itinerary-caterer-update.component.html',
})
export class ItineraryCatererUpdateComponent implements OnInit {
  isSaving = false;
  itineraryCaterer: IItineraryCaterer | null = null;

  editForm: ItineraryCatererFormGroup = this.itineraryCatererFormService.createItineraryCatererFormGroup();

  constructor(
    protected itineraryCatererService: ItineraryCatererService,
    protected itineraryCatererFormService: ItineraryCatererFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryCaterer }) => {
      this.itineraryCaterer = itineraryCaterer;
      if (itineraryCaterer) {
        this.updateForm(itineraryCaterer);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itineraryCaterer = this.itineraryCatererFormService.getItineraryCaterer(this.editForm);
    if (itineraryCaterer.id !== null) {
      this.subscribeToSaveResponse(this.itineraryCatererService.update(itineraryCaterer));
    } else {
      this.subscribeToSaveResponse(this.itineraryCatererService.create(itineraryCaterer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItineraryCaterer>>): void {
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

  protected updateForm(itineraryCaterer: IItineraryCaterer): void {
    this.itineraryCaterer = itineraryCaterer;
    this.itineraryCatererFormService.resetForm(this.editForm, itineraryCaterer);
  }
}
