import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CaterersFormService, CaterersFormGroup } from './caterers-form.service';
import { ICaterers } from '../caterers.model';
import { CaterersService } from '../service/caterers.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IBookedCaterer } from 'app/entities/booked-caterer/booked-caterer.model';
import { BookedCatererService } from 'app/entities/booked-caterer/service/booked-caterer.service';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { EventItineraryService } from 'app/entities/event-itinerary/service/event-itinerary.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { IDietaryRequirements } from 'app/entities/dietary-requirements/dietary-requirements.model';
import { DietaryRequirementsService } from 'app/entities/dietary-requirements/service/dietary-requirements.service';
import { ICuisine } from 'app/entities/cuisine/cuisine.model';
import { CuisineService } from 'app/entities/cuisine/service/cuisine.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

@Component({
  selector: 'jhi-caterers-update',
  templateUrl: './caterers-update.component.html',
})
export class CaterersUpdateComponent implements OnInit {
  isSaving = false;
  caterers: ICaterers | null = null;

  bookedCaterersCollection: IBookedCaterer[] = [];
  eventItinerariesSharedCollection: IEventItinerary[] = [];
  suppliersSharedCollection: ISupplier[] = [];
  dietaryRequirementsSharedCollection: IDietaryRequirements[] = [];
  cuisinesSharedCollection: ICuisine[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm: CaterersFormGroup = this.caterersFormService.createCaterersFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected caterersService: CaterersService,
    protected caterersFormService: CaterersFormService,
    protected bookedCatererService: BookedCatererService,
    protected eventItineraryService: EventItineraryService,
    protected supplierService: SupplierService,
    protected dietaryRequirementsService: DietaryRequirementsService,
    protected cuisineService: CuisineService,
    protected eventService: EventService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBookedCaterer = (o1: IBookedCaterer | null, o2: IBookedCaterer | null): boolean =>
    this.bookedCatererService.compareBookedCaterer(o1, o2);

  compareEventItinerary = (o1: IEventItinerary | null, o2: IEventItinerary | null): boolean =>
    this.eventItineraryService.compareEventItinerary(o1, o2);

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  compareDietaryRequirements = (o1: IDietaryRequirements | null, o2: IDietaryRequirements | null): boolean =>
    this.dietaryRequirementsService.compareDietaryRequirements(o1, o2);

  compareCuisine = (o1: ICuisine | null, o2: ICuisine | null): boolean => this.cuisineService.compareCuisine(o1, o2);

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caterers }) => {
      this.caterers = caterers;
      if (caterers) {
        this.updateForm(caterers);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const caterers = this.caterersFormService.getCaterers(this.editForm);
    if (caterers.id !== null) {
      this.subscribeToSaveResponse(this.caterersService.update(caterers));
    } else {
      this.subscribeToSaveResponse(this.caterersService.create(caterers));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICaterers>>): void {
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

  protected updateForm(caterers: ICaterers): void {
    this.caterers = caterers;
    this.caterersFormService.resetForm(this.editForm, caterers);

    this.bookedCaterersCollection = this.bookedCatererService.addBookedCatererToCollectionIfMissing<IBookedCaterer>(
      this.bookedCaterersCollection,
      caterers.bookedCaterer
    );
    this.eventItinerariesSharedCollection = this.eventItineraryService.addEventItineraryToCollectionIfMissing<IEventItinerary>(
      this.eventItinerariesSharedCollection,
      caterers.eventItinerary
    );
    this.suppliersSharedCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersSharedCollection,
      caterers.supplier
    );
    this.dietaryRequirementsSharedCollection =
      this.dietaryRequirementsService.addDietaryRequirementsToCollectionIfMissing<IDietaryRequirements>(
        this.dietaryRequirementsSharedCollection,
        ...(caterers.dietaryRequirements ?? [])
      );
    this.cuisinesSharedCollection = this.cuisineService.addCuisineToCollectionIfMissing<ICuisine>(
      this.cuisinesSharedCollection,
      ...(caterers.cuisines ?? [])
    );
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing<IEvent>(this.eventsSharedCollection, caterers.event);
  }

  protected loadRelationshipsOptions(): void {
    this.bookedCatererService
      .query({ filter: 'caterers-is-null' })
      .pipe(map((res: HttpResponse<IBookedCaterer[]>) => res.body ?? []))
      .pipe(
        map((bookedCaterers: IBookedCaterer[]) =>
          this.bookedCatererService.addBookedCatererToCollectionIfMissing<IBookedCaterer>(bookedCaterers, this.caterers?.bookedCaterer)
        )
      )
      .subscribe((bookedCaterers: IBookedCaterer[]) => (this.bookedCaterersCollection = bookedCaterers));

    this.eventItineraryService
      .query()
      .pipe(map((res: HttpResponse<IEventItinerary[]>) => res.body ?? []))
      .pipe(
        map((eventItineraries: IEventItinerary[]) =>
          this.eventItineraryService.addEventItineraryToCollectionIfMissing<IEventItinerary>(
            eventItineraries,
            this.caterers?.eventItinerary
          )
        )
      )
      .subscribe((eventItineraries: IEventItinerary[]) => (this.eventItinerariesSharedCollection = eventItineraries));

    this.supplierService
      .query()
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.caterers?.supplier)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersSharedCollection = suppliers));

    this.dietaryRequirementsService
      .query()
      .pipe(map((res: HttpResponse<IDietaryRequirements[]>) => res.body ?? []))
      .pipe(
        map((dietaryRequirements: IDietaryRequirements[]) =>
          this.dietaryRequirementsService.addDietaryRequirementsToCollectionIfMissing<IDietaryRequirements>(
            dietaryRequirements,
            ...(this.caterers?.dietaryRequirements ?? [])
          )
        )
      )
      .subscribe((dietaryRequirements: IDietaryRequirements[]) => (this.dietaryRequirementsSharedCollection = dietaryRequirements));

    this.cuisineService
      .query()
      .pipe(map((res: HttpResponse<ICuisine[]>) => res.body ?? []))
      .pipe(
        map((cuisines: ICuisine[]) =>
          this.cuisineService.addCuisineToCollectionIfMissing<ICuisine>(cuisines, ...(this.caterers?.cuisines ?? []))
        )
      )
      .subscribe((cuisines: ICuisine[]) => (this.cuisinesSharedCollection = cuisines));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing<IEvent>(events, this.caterers?.event)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));
  }
}
