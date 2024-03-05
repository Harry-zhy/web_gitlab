import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FavouritesListFormService, FavouritesListFormGroup } from './favourites-list-form.service';
import { IFavouritesList } from '../favourites-list.model';
import { FavouritesListService } from '../service/favourites-list.service';

@Component({
  selector: 'jhi-favourites-list-update',
  templateUrl: './favourites-list-update.component.html',
})
export class FavouritesListUpdateComponent implements OnInit {
  isSaving = false;
  favouritesList: IFavouritesList | null = null;

  editForm: FavouritesListFormGroup = this.favouritesListFormService.createFavouritesListFormGroup();

  constructor(
    protected favouritesListService: FavouritesListService,
    protected favouritesListFormService: FavouritesListFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ favouritesList }) => {
      this.favouritesList = favouritesList;
      if (favouritesList) {
        this.updateForm(favouritesList);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const favouritesList = this.favouritesListFormService.getFavouritesList(this.editForm);
    if (favouritesList.id !== null) {
      this.subscribeToSaveResponse(this.favouritesListService.update(favouritesList));
    } else {
      this.subscribeToSaveResponse(this.favouritesListService.create(favouritesList));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFavouritesList>>): void {
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

  protected updateForm(favouritesList: IFavouritesList): void {
    this.favouritesList = favouritesList;
    this.favouritesListFormService.resetForm(this.editForm, favouritesList);
  }
}
