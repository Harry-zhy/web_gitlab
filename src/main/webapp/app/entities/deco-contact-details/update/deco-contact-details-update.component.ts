import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DecoContactDetailsFormService, DecoContactDetailsFormGroup } from './deco-contact-details-form.service';
import { IDecoContactDetails } from '../deco-contact-details.model';
import { DecoContactDetailsService } from '../service/deco-contact-details.service';

@Component({
  selector: 'jhi-deco-contact-details-update',
  templateUrl: './deco-contact-details-update.component.html',
})
export class DecoContactDetailsUpdateComponent implements OnInit {
  isSaving = false;
  decoContactDetails: IDecoContactDetails | null = null;

  editForm: DecoContactDetailsFormGroup = this.decoContactDetailsFormService.createDecoContactDetailsFormGroup();

  constructor(
    protected decoContactDetailsService: DecoContactDetailsService,
    protected decoContactDetailsFormService: DecoContactDetailsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoContactDetails }) => {
      this.decoContactDetails = decoContactDetails;
      if (decoContactDetails) {
        this.updateForm(decoContactDetails);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const decoContactDetails = this.decoContactDetailsFormService.getDecoContactDetails(this.editForm);
    if (decoContactDetails.id !== null) {
      this.subscribeToSaveResponse(this.decoContactDetailsService.update(decoContactDetails));
    } else {
      this.subscribeToSaveResponse(this.decoContactDetailsService.create(decoContactDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecoContactDetails>>): void {
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

  protected updateForm(decoContactDetails: IDecoContactDetails): void {
    this.decoContactDetails = decoContactDetails;
    this.decoContactDetailsFormService.resetForm(this.editForm, decoContactDetails);
  }
}
