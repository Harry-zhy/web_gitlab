import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItineraryDateTime } from '../itinerary-date-time.model';
import { ItineraryDateTimeService } from '../service/itinerary-date-time.service';

@Injectable({ providedIn: 'root' })
export class ItineraryDateTimeRoutingResolveService implements Resolve<IItineraryDateTime | null> {
  constructor(protected service: ItineraryDateTimeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItineraryDateTime | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itineraryDateTime: HttpResponse<IItineraryDateTime>) => {
          if (itineraryDateTime.body) {
            return of(itineraryDateTime.body);
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
