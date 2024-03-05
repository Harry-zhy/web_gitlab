import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItineraryVenue } from '../itinerary-venue.model';
import { ItineraryVenueService } from '../service/itinerary-venue.service';

@Injectable({ providedIn: 'root' })
export class ItineraryVenueRoutingResolveService implements Resolve<IItineraryVenue | null> {
  constructor(protected service: ItineraryVenueService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItineraryVenue | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itineraryVenue: HttpResponse<IItineraryVenue>) => {
          if (itineraryVenue.body) {
            return of(itineraryVenue.body);
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
