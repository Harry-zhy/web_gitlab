import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFavouritesListItem } from '../favourites-list-item.model';
import { FavouritesListItemService } from '../service/favourites-list-item.service';

@Injectable({ providedIn: 'root' })
export class FavouritesListItemRoutingResolveService implements Resolve<IFavouritesListItem | null> {
  constructor(protected service: FavouritesListItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFavouritesListItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((favouritesListItem: HttpResponse<IFavouritesListItem>) => {
          if (favouritesListItem.body) {
            return of(favouritesListItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
