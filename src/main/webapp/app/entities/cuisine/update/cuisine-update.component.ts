import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CuisineFormService, CuisineFormGroup } from './cuisine-form.service';
import { ICuisine } from '../cuisine.model';
import { CuisineService } from '../service/cuisine.service';

@Component({
  selector: 'jhi-cuisine-update',
  templateUrl: './cuisine-update.component.html',
})
export class CuisineUpdateComponent implements OnInit {
  isSaving = false;
  cuisine: ICuisine | null = null;

  editForm: CuisineFormGroup = this.cuisineFormService.createCuisineFormGroup();

  constructor(
    protected cuisineService: CuisineService,
    protected cuisineFormService: CuisineFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cuisine }) => {
      this.cuisine = cuisine;
      if (cuisine) {
        this.updateForm(cuisine);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cuisine = this.cuisineFormService.getCuisine(this.editForm);
    if (cuisine.id !== null) {
      this.subscribeToSaveResponse(this.cuisineService.update(cuisine));
    } else {
      this.subscribeToSaveResponse(this.cuisineService.create(cuisine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICuisine>>): void {
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

  protected updateForm(cuisine: ICuisine): void {
    this.cuisine = cuisine;
    this.cuisineFormService.resetForm(this.editForm, cuisine);
  }
}
