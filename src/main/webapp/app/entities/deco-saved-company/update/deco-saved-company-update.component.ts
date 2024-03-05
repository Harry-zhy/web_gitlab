import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DecoSavedCompanyFormService, DecoSavedCompanyFormGroup } from './deco-saved-company-form.service';
import { IDecoSavedCompany } from '../deco-saved-company.model';
import { DecoSavedCompanyService } from '../service/deco-saved-company.service';

@Component({
  selector: 'jhi-deco-saved-company-update',
  templateUrl: './deco-saved-company-update.component.html',
})
export class DecoSavedCompanyUpdateComponent implements OnInit {
  isSaving = false;
  decoSavedCompany: IDecoSavedCompany | null = null;

  editForm: DecoSavedCompanyFormGroup = this.decoSavedCompanyFormService.createDecoSavedCompanyFormGroup();

  constructor(
    protected decoSavedCompanyService: DecoSavedCompanyService,
    protected decoSavedCompanyFormService: DecoSavedCompanyFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoSavedCompany }) => {
      this.decoSavedCompany = decoSavedCompany;
      if (decoSavedCompany) {
        this.updateForm(decoSavedCompany);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const decoSavedCompany = this.decoSavedCompanyFormService.getDecoSavedCompany(this.editForm);
    if (decoSavedCompany.id !== null) {
      this.subscribeToSaveResponse(this.decoSavedCompanyService.update(decoSavedCompany));
    } else {
      this.subscribeToSaveResponse(this.decoSavedCompanyService.create(decoSavedCompany));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecoSavedCompany>>): void {
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

  protected updateForm(decoSavedCompany: IDecoSavedCompany): void {
    this.decoSavedCompany = decoSavedCompany;
    this.decoSavedCompanyFormService.resetForm(this.editForm, decoSavedCompany);
  }
}
