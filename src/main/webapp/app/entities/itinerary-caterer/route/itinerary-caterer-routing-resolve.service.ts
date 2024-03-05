import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItineraryCaterer } from '../itinerary-caterer.model';
import { ItineraryCatererService } from '../service/itinerary-caterer.service';

@Injectable({ providedIn: 'root' })
export class ItineraryCatererRoutingResolveService implements Resolve<IItineraryCaterer | null> {
  constructor(protected service: ItineraryCatererService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItineraryCaterer | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itineraryCaterer: HttpResponse<IItineraryCaterer>) => {
          if (itineraryCaterer.body) {
            return of(itineraryCaterer.body);
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
