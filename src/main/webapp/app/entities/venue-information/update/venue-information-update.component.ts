import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VenueInformationFormService, VenueInformationFormGroup } from './venue-information-form.service';
import { IVenueInformation } from '../venue-information.model';
import { VenueInformationService } from '../service/venue-information.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { EventItineraryService } from 'app/entities/event-itinerary/service/event-itinerary.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

@Component({
  selector: 'jhi-venue-information-update',
  templateUrl: './venue-information-update.component.html',
})
export class VenueInformationUpdateComponent implements OnInit {
  isSaving = false;
  venueInformation: IVenueInformation | null = null;

  eventItinerariesSharedCollection: IEventItinerary[] = [];
  suppliersSharedCollection: ISupplier[] = [];

  editForm: VenueInformationFormGroup = this.venueInformationFormService.createVenueInformationFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected venueInformationService: VenueInformationService,
    protected venueInformationFormService: VenueInformationFormService,
    protected eventItineraryService: EventItineraryService,
    protected supplierService: SupplierService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEventItinerary = (o1: IEventItinerary | null, o2: IEventItinerary | null): boolean =>
    this.eventItineraryService.compareEventItinerary(o1, o2);

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ venueInformation }) => {
      this.venueInformation = venueInformation;
      if (venueInformation) {
        this.updateForm(venueInformation);
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
    const venueInformation = this.venueInformationFormService.getVenueInformation(this.editForm);
    if (venueInformation.id !== null) {
      this.subscribeToSaveResponse(this.venueInformationService.update(venueInformation));
    } else {
      this.subscribeToSaveResponse(this.venueInformationService.create(venueInformation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVenueInformation>>): void {
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

  protected updateForm(venueInformation: IVenueInformation): void {
    this.venueInformation = venueInformation;
    this.venueInformationFormService.resetForm(this.editForm, venueInformation);

    this.eventItinerariesSharedCollection = this.eventItineraryService.addEventItineraryToCollectionIfMissing<IEventItinerary>(
      this.eventItinerariesSharedCollection,
      venueInformation.eventItinerary
    );
    this.suppliersSharedCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersSharedCollection,
      venueInformation.supplier
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
            this.venueInformation?.eventItinerary
          )
        )
      )
      .subscribe((eventItineraries: IEventItinerary[]) => (this.eventItinerariesSharedCollection = eventItineraries));

    this.supplierService
      .query()
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.venueInformation?.supplier)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersSharedCollection = suppliers));
  }
}
