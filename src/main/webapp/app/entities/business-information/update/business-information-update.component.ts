import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BusinessInformationFormService, BusinessInformationFormGroup } from './business-information-form.service';
import { IBusinessInformation } from '../business-information.model';
import { BusinessInformationService } from '../service/business-information.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

@Component({
  selector: 'jhi-business-information-update',
  templateUrl: './business-information-update.component.html',
})
export class BusinessInformationUpdateComponent implements OnInit {
  isSaving = false;
  businessInformation: IBusinessInformation | null = null;

  suppliersSharedCollection: ISupplier[] = [];

  editForm: BusinessInformationFormGroup = this.businessInformationFormService.createBusinessInformationFormGroup();

  constructor(
    protected businessInformationService: BusinessInformationService,
    protected businessInformationFormService: BusinessInformationFormService,
    protected supplierService: SupplierService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessInformation }) => {
      this.businessInformation = businessInformation;
      if (businessInformation) {
        this.updateForm(businessInformation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const businessInformation = this.businessInformationFormService.getBusinessInformation(this.editForm);
    if (businessInformation.id !== null) {
      this.subscribeToSaveResponse(this.businessInformationService.update(businessInformation));
    } else {
      this.subscribeToSaveResponse(this.businessInformationService.create(businessInformation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessInformation>>): void {
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

  protected updateForm(businessInformation: IBusinessInformation): void {
    this.businessInformation = businessInformation;
    this.businessInformationFormService.resetForm(this.editForm, businessInformation);

    this.suppliersSharedCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersSharedCollection,
      businessInformation.supplier
    );
  }

  protected loadRelationshipsOptions(): void {
    this.supplierService
      .query()
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.businessInformation?.supplier)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersSharedCollection = suppliers));
  }
}
