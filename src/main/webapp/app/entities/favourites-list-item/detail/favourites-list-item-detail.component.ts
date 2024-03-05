import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFavouritesListItem } from '../favourites-list-item.model';

@Component({
  selector: 'jhi-favourites-list-item-detail',
  templateUrl: './favourites-list-item-detail.component.html',
})
export class FavouritesListItemDetailComponent implements OnInit {
  favouritesListItem: IFavouritesListItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ favouritesListItem }) => {
      this.favouritesListItem = favouritesListItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
