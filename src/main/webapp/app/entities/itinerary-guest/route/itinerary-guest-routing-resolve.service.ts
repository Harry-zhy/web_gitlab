import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItineraryGuest } from '../itinerary-guest.model';
import { ItineraryGuestService } from '../service/itinerary-guest.service';

@Injectable({ providedIn: 'root' })
export class ItineraryGuestRoutingResolveService implements Resolve<IItineraryGuest | null> {
  constructor(protected service: ItineraryGuestService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItineraryGuest | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itineraryGuest: HttpResponse<IItineraryGuest>) => {
          if (itineraryGuest.body) {
            return of(itineraryGuest.body);
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
