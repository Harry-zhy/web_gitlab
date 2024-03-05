import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DietaryRequirementsFormService, DietaryRequirementsFormGroup } from './dietary-requirements-form.service';
import { IDietaryRequirements } from '../dietary-requirements.model';
import { DietaryRequirementsService } from '../service/dietary-requirements.service';

@Component({
  selector: 'jhi-dietary-requirements-update',
  templateUrl: './dietary-requirements-update.component.html',
})
export class DietaryRequirementsUpdateComponent implements OnInit {
  isSaving = false;
  dietaryRequirements: IDietaryRequirements | null = null;

  editForm: DietaryRequirementsFormGroup = this.dietaryRequirementsFormService.createDietaryRequirementsFormGroup();

  constructor(
    protected dietaryRequirementsService: DietaryRequirementsService,
    protected dietaryRequirementsFormService: DietaryRequirementsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dietaryRequirements }) => {
      this.dietaryRequirements = dietaryRequirements;
      if (dietaryRequirements) {
        this.updateForm(dietaryRequirements);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dietaryRequirements = this.dietaryRequirementsFormService.getDietaryRequirements(this.editForm);
    if (dietaryRequirements.id !== null) {
      this.subscribeToSaveResponse(this.dietaryRequirementsService.update(dietaryRequirements));
    } else {
      this.subscribeToSaveResponse(this.dietaryRequirementsService.create(dietaryRequirements));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDietaryRequirements>>): void {
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

  protected updateForm(dietaryRequirements: IDietaryRequirements): void {
    this.dietaryRequirements = dietaryRequirements;
    this.dietaryRequirementsFormService.resetForm(this.editForm, dietaryRequirements);
  }
}
