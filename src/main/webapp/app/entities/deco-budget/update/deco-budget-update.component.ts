import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DecoBudgetFormService, DecoBudgetFormGroup } from './deco-budget-form.service';
import { IDecoBudget } from '../deco-budget.model';
import { DecoBudgetService } from '../service/deco-budget.service';
import { IDecoCompany } from 'app/entities/deco-company/deco-company.model';
import { DecoCompanyService } from 'app/entities/deco-company/service/deco-company.service';

@Component({
  selector: 'jhi-deco-budget-update',
  templateUrl: './deco-budget-update.component.html',
})
export class DecoBudgetUpdateComponent implements OnInit {
  isSaving = false;
  decoBudget: IDecoBudget | null = null;

  decoCompaniesSharedCollection: IDecoCompany[] = [];

  editForm: DecoBudgetFormGroup = this.decoBudgetFormService.createDecoBudgetFormGroup();

  constructor(
    protected decoBudgetService: DecoBudgetService,
    protected decoBudgetFormService: DecoBudgetFormService,
    protected decoCompanyService: DecoCompanyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDecoCompany = (o1: IDecoCompany | null, o2: IDecoCompany | null): boolean => this.decoCompanyService.compareDecoCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoBudget }) => {
      this.decoBudget = decoBudget;
      if (decoBudget) {
        this.updateForm(decoBudget);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const decoBudget = this.decoBudgetFormService.getDecoBudget(this.editForm);
    if (decoBudget.id !== null) {
      this.subscribeToSaveResponse(this.decoBudgetService.update(decoBudget));
    } else {
      this.subscribeToSaveResponse(this.decoBudgetService.create(decoBudget));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecoBudget>>): void {
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

  protected updateForm(decoBudget: IDecoBudget): void {
    this.decoBudget = decoBudget;
    this.decoBudgetFormService.resetForm(this.editForm, decoBudget);

    this.decoCompaniesSharedCollection = this.decoCompanyService.addDecoCompanyToCollectionIfMissing<IDecoCompany>(
      this.decoCompaniesSharedCollection,
      ...(decoBudget.decoCompanies ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.decoCompanyService
      .query()
      .pipe(map((res: HttpResponse<IDecoCompany[]>) => res.body ?? []))
      .pipe(
        map((decoCompanies: IDecoCompany[]) =>
          this.decoCompanyService.addDecoCompanyToCollectionIfMissing<IDecoCompany>(
            decoCompanies,
            ...(this.decoBudget?.decoCompanies ?? [])
          )
        )
      )
      .subscribe((decoCompanies: IDecoCompany[]) => (this.decoCompaniesSharedCollection = decoCompanies));
  }
}
