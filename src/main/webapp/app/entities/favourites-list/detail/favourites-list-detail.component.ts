import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFavouritesList } from '../favourites-list.model';

@Component({
  selector: 'jhi-favourites-list-detail',
  templateUrl: './favourites-list-detail.component.html',
})
export class FavouritesListDetailComponent implements OnInit {
  favouritesList: IFavouritesList | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ favouritesList }) => {
      this.favouritesList = favouritesList;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
