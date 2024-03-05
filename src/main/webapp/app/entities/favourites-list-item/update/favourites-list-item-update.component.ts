import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FavouritesListItemFormService, FavouritesListItemFormGroup } from './favourites-list-item-form.service';
import { IFavouritesListItem } from '../favourites-list-item.model';
import { FavouritesListItemService } from '../service/favourites-list-item.service';
import { ICaterers } from 'app/entities/caterers/caterers.model';
import { CaterersService } from 'app/entities/caterers/service/caterers.service';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { ActivitySelfService } from 'app/entities/activity-self/service/activity-self.service';
import { IVenueInformation } from 'app/entities/venue-information/venue-information.model';
import { VenueInformationService } from 'app/entities/venue-information/service/venue-information.service';
import { IFavouritesList } from 'app/entities/favourites-list/favourites-list.model';
import { FavouritesListService } from 'app/entities/favourites-list/service/favourites-list.service';
import { Category } from 'app/entities/enumerations/category.model';

@Component({
  selector: 'jhi-favourites-list-item-update',
  templateUrl: './favourites-list-item-update.component.html',
})
export class FavouritesListItemUpdateComponent implements OnInit {
  isSaving = false;
  favouritesListItem: IFavouritesListItem | null = null;
  categoryValues = Object.keys(Category);

  caterersSharedCollection: ICaterers[] = [];
  activitySelvesSharedCollection: IActivitySelf[] = [];
  venueInformationsSharedCollection: IVenueInformation[] = [];
  favouritesListsSharedCollection: IFavouritesList[] = [];

  editForm: FavouritesListItemFormGroup = this.favouritesListItemFormService.createFavouritesListItemFormGroup();

  constructor(
    protected favouritesListItemService: FavouritesListItemService,
    protected favouritesListItemFormService: FavouritesListItemFormService,
    protected caterersService: CaterersService,
    protected activitySelfService: ActivitySelfService,
    protected venueInformationService: VenueInformationService,
    protected favouritesListService: FavouritesListService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCaterers = (o1: ICaterers | null, o2: ICaterers | null): boolean => this.caterersService.compareCaterers(o1, o2);

  compareActivitySelf = (o1: IActivitySelf | null, o2: IActivitySelf | null): boolean =>
    this.activitySelfService.compareActivitySelf(o1, o2);

  compareVenueInformation = (o1: IVenueInformation | null, o2: IVenueInformation | null): boolean =>
    this.venueInformationService.compareVenueInformation(o1, o2);

  compareFavouritesList = (o1: IFavouritesList | null, o2: IFavouritesList | null): boolean =>
    this.favouritesListService.compareFavouritesList(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ favouritesListItem }) => {
      this.favouritesListItem = favouritesListItem;
      if (favouritesListItem) {
        this.updateForm(favouritesListItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const favouritesListItem = this.favouritesListItemFormService.getFavouritesListItem(this.editForm);
    if (favouritesListItem.id !== null) {
      this.subscribeToSaveResponse(this.favouritesListItemService.update(favouritesListItem));
    } else {
      this.subscribeToSaveResponse(this.favouritesListItemService.create(favouritesListItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFavouritesListItem>>): void {
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

  protected updateForm(favouritesListItem: IFavouritesListItem): void {
    this.favouritesListItem = favouritesListItem;
    this.favouritesListItemFormService.resetForm(this.editForm, favouritesListItem);

    this.caterersSharedCollection = this.caterersService.addCaterersToCollectionIfMissing<ICaterers>(
      this.caterersSharedCollection,
      favouritesListItem.caterer
    );
    this.activitySelvesSharedCollection = this.activitySelfService.addActivitySelfToCollectionIfMissing<IActivitySelf>(
      this.activitySelvesSharedCollection,
      favouritesListItem.activity
    );
    this.venueInformationsSharedCollection = this.venueInformationService.addVenueInformationToCollectionIfMissing<IVenueInformation>(
      this.venueInformationsSharedCollection,
      favouritesListItem.venue
    );
    this.favouritesListsSharedCollection = this.favouritesListService.addFavouritesListToCollectionIfMissing<IFavouritesList>(
      this.favouritesListsSharedCollection,
      favouritesListItem.favouritesList
    );
  }

  protected loadRelationshipsOptions(): void {
    this.caterersService
      .query()
      .pipe(map((res: HttpResponse<ICaterers[]>) => res.body ?? []))
      .pipe(
        map((caterers: ICaterers[]) =>
          this.caterersService.addCaterersToCollectionIfMissing<ICaterers>(caterers, this.favouritesListItem?.caterer)
        )
      )
      .subscribe((caterers: ICaterers[]) => (this.caterersSharedCollection = caterers));

    this.activitySelfService
      .query()
      .pipe(map((res: HttpResponse<IActivitySelf[]>) => res.body ?? []))
      .pipe(
        map((activitySelves: IActivitySelf[]) =>
          this.activitySelfService.addActivitySelfToCollectionIfMissing<IActivitySelf>(activitySelves, this.favouritesListItem?.activity)
        )
      )
      .subscribe((activitySelves: IActivitySelf[]) => (this.activitySelvesSharedCollection = activitySelves));

    this.venueInformationService
      .query()
      .pipe(map((res: HttpResponse<IVenueInformation[]>) => res.body ?? []))
      .pipe(
        map((venueInformations: IVenueInformation[]) =>
          this.venueInformationService.addVenueInformationToCollectionIfMissing<IVenueInformation>(
            venueInformations,
            this.favouritesListItem?.venue
          )
        )
      )
      .subscribe((venueInformations: IVenueInformation[]) => (this.venueInformationsSharedCollection = venueInformations));

    this.favouritesListService
      .query()
      .pipe(map((res: HttpResponse<IFavouritesList[]>) => res.body ?? []))
      .pipe(
        map((favouritesLists: IFavouritesList[]) =>
          this.favouritesListService.addFavouritesListToCollectionIfMissing<IFavouritesList>(
            favouritesLists,
            this.favouritesListItem?.favouritesList
          )
        )
      )
      .subscribe((favouritesLists: IFavouritesList[]) => (this.favouritesListsSharedCollection = favouritesLists));
  }
}
