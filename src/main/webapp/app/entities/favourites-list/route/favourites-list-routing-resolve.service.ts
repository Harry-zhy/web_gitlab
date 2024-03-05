import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFavouritesList } from '../favourites-list.model';
import { FavouritesListService } from '../service/favourites-list.service';

@Injectable({ providedIn: 'root' })
export class FavouritesListRoutingResolveService implements Resolve<IFavouritesList | null> {
  constructor(protected service: FavouritesListService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFavouritesList | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((favouritesList: HttpResponse<IFavouritesList>) => {
          if (favouritesList.body) {
            return of(favouritesList.body);
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
