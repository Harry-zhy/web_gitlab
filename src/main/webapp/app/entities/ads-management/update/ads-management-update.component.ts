import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AdsManagementFormService, AdsManagementFormGroup } from './ads-management-form.service';
import { IAdsManagement } from '../ads-management.model';
import { AdsManagementService } from '../service/ads-management.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

@Component({
  selector: 'jhi-ads-management-update',
  templateUrl: './ads-management-update.component.html',
})
export class AdsManagementUpdateComponent implements OnInit {
  isSaving = false;
  adsManagement: IAdsManagement | null = null;

  suppliersSharedCollection: ISupplier[] = [];

  editForm: AdsManagementFormGroup = this.adsManagementFormService.createAdsManagementFormGroup();

  constructor(
    protected adsManagementService: AdsManagementService,
    protected adsManagementFormService: AdsManagementFormService,
    protected supplierService: SupplierService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adsManagement }) => {
      this.adsManagement = adsManagement;
      if (adsManagement) {
        this.updateForm(adsManagement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const adsManagement = this.adsManagementFormService.getAdsManagement(this.editForm);
    if (adsManagement.id !== null) {
      this.subscribeToSaveResponse(this.adsManagementService.update(adsManagement));
    } else {
      this.subscribeToSaveResponse(this.adsManagementService.create(adsManagement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdsManagement>>): void {
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

  protected updateForm(adsManagement: IAdsManagement): void {
    this.adsManagement = adsManagement;
    this.adsManagementFormService.resetForm(this.editForm, adsManagement);

    this.suppliersSharedCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersSharedCollection,
      adsManagement.supplier
    );
  }

  protected loadRelationshipsOptions(): void {
    this.supplierService
      .query()
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.adsManagement?.supplier)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersSharedCollection = suppliers));
  }
}
