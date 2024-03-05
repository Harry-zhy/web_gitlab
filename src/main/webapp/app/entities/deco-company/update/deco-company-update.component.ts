import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DecoCompanyFormService, DecoCompanyFormGroup } from './deco-company-form.service';
import { IDecoCompany } from '../deco-company.model';
import { DecoCompanyService } from '../service/deco-company.service';
import { IDecoContactDetails } from 'app/entities/deco-contact-details/deco-contact-details.model';
import { DecoContactDetailsService } from 'app/entities/deco-contact-details/service/deco-contact-details.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { IDecoSavedCompany } from 'app/entities/deco-saved-company/deco-saved-company.model';
import { DecoSavedCompanyService } from 'app/entities/deco-saved-company/service/deco-saved-company.service';

@Component({
  selector: 'jhi-deco-company-update',
  templateUrl: './deco-company-update.component.html',
})
export class DecoCompanyUpdateComponent implements OnInit {
  isSaving = false;
  decoCompany: IDecoCompany | null = null;

  decoContactDetailsCollection: IDecoContactDetails[] = [];
  suppliersCollection: ISupplier[] = [];
  decoSavedCompaniesSharedCollection: IDecoSavedCompany[] = [];

  editForm: DecoCompanyFormGroup = this.decoCompanyFormService.createDecoCompanyFormGroup();

  constructor(
    protected decoCompanyService: DecoCompanyService,
    protected decoCompanyFormService: DecoCompanyFormService,
    protected decoContactDetailsService: DecoContactDetailsService,
    protected supplierService: SupplierService,
    protected decoSavedCompanyService: DecoSavedCompanyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDecoContactDetails = (o1: IDecoContactDetails | null, o2: IDecoContactDetails | null): boolean =>
    this.decoContactDetailsService.compareDecoContactDetails(o1, o2);

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  compareDecoSavedCompany = (o1: IDecoSavedCompany | null, o2: IDecoSavedCompany | null): boolean =>
    this.decoSavedCompanyService.compareDecoSavedCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoCompany }) => {
      this.decoCompany = decoCompany;
      if (decoCompany) {
        this.updateForm(decoCompany);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const decoCompany = this.decoCompanyFormService.getDecoCompany(this.editForm);
    if (decoCompany.id !== null) {
      this.subscribeToSaveResponse(this.decoCompanyService.update(decoCompany));
    } else {
      this.subscribeToSaveResponse(this.decoCompanyService.create(decoCompany));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecoCompany>>): void {
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

  protected updateForm(decoCompany: IDecoCompany): void {
    this.decoCompany = decoCompany;
    this.decoCompanyFormService.resetForm(this.editForm, decoCompany);

    this.decoContactDetailsCollection = this.decoContactDetailsService.addDecoContactDetailsToCollectionIfMissing<IDecoContactDetails>(
      this.decoContactDetailsCollection,
      decoCompany.decoContactDetails
    );
    this.suppliersCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersCollection,
      decoCompany.supplier
    );
    this.decoSavedCompaniesSharedCollection = this.decoSavedCompanyService.addDecoSavedCompanyToCollectionIfMissing<IDecoSavedCompany>(
      this.decoSavedCompaniesSharedCollection,
      ...(decoCompany.decoSavedCompanies ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.decoContactDetailsService
      .query({ filter: 'decocompany-is-null' })
      .pipe(map((res: HttpResponse<IDecoContactDetails[]>) => res.body ?? []))
      .pipe(
        map((decoContactDetails: IDecoContactDetails[]) =>
          this.decoContactDetailsService.addDecoContactDetailsToCollectionIfMissing<IDecoContactDetails>(
            decoContactDetails,
            this.decoCompany?.decoContactDetails
          )
        )
      )
      .subscribe((decoContactDetails: IDecoContactDetails[]) => (this.decoContactDetailsCollection = decoContactDetails));

    this.supplierService
      .query({ filter: 'decocompany-is-null' })
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.decoCompany?.supplier)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersCollection = suppliers));

    this.decoSavedCompanyService
      .query()
      .pipe(map((res: HttpResponse<IDecoSavedCompany[]>) => res.body ?? []))
      .pipe(
        map((decoSavedCompanies: IDecoSavedCompany[]) =>
          this.decoSavedCompanyService.addDecoSavedCompanyToCollectionIfMissing<IDecoSavedCompany>(
            decoSavedCompanies,
            ...(this.decoCompany?.decoSavedCompanies ?? [])
          )
        )
      )
      .subscribe((decoSavedCompanies: IDecoSavedCompany[]) => (this.decoSavedCompaniesSharedCollection = decoSavedCompanies));
  }
}
