import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BookedCatererFormService, BookedCatererFormGroup } from './booked-caterer-form.service';
import { IBookedCaterer } from '../booked-caterer.model';
import { BookedCatererService } from '../service/booked-caterer.service';
import { IItinerary } from 'app/entities/itinerary/itinerary.model';
import { ItineraryService } from 'app/entities/itinerary/service/itinerary.service';

@Component({
  selector: 'jhi-booked-caterer-update',
  templateUrl: './booked-caterer-update.component.html',
})
export class BookedCatererUpdateComponent implements OnInit {
  isSaving = false;
  bookedCaterer: IBookedCaterer | null = null;

  itinerariesSharedCollection: IItinerary[] = [];

  editForm: BookedCatererFormGroup = this.bookedCatererFormService.createBookedCatererFormGroup();

  constructor(
    protected bookedCatererService: BookedCatererService,
    protected bookedCatererFormService: BookedCatererFormService,
    protected itineraryService: ItineraryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareItinerary = (o1: IItinerary | null, o2: IItinerary | null): boolean => this.itineraryService.compareItinerary(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookedCaterer }) => {
      this.bookedCaterer = bookedCaterer;
      if (bookedCaterer) {
        this.updateForm(bookedCaterer);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookedCaterer = this.bookedCatererFormService.getBookedCaterer(this.editForm);
    if (bookedCaterer.id !== null) {
      this.subscribeToSaveResponse(this.bookedCatererService.update(bookedCaterer));
    } else {
      this.subscribeToSaveResponse(this.bookedCatererService.create(bookedCaterer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookedCaterer>>): void {
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

  protected updateForm(bookedCaterer: IBookedCaterer): void {
    this.bookedCaterer = bookedCaterer;
    this.bookedCatererFormService.resetForm(this.editForm, bookedCaterer);

    this.itinerariesSharedCollection = this.itineraryService.addItineraryToCollectionIfMissing<IItinerary>(
      this.itinerariesSharedCollection,
      bookedCaterer.itinerary
    );
  }

  protected loadRelationshipsOptions(): void {
    this.itineraryService
      .query()
      .pipe(map((res: HttpResponse<IItinerary[]>) => res.body ?? []))
      .pipe(
        map((itineraries: IItinerary[]) =>
          this.itineraryService.addItineraryToCollectionIfMissing<IItinerary>(itineraries, this.bookedCaterer?.itinerary)
        )
      )
      .subscribe((itineraries: IItinerary[]) => (this.itinerariesSharedCollection = itineraries));
  }
}
