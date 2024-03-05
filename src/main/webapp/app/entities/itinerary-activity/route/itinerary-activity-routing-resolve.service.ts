import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItineraryActivity } from '../itinerary-activity.model';
import { ItineraryActivityService } from '../service/itinerary-activity.service';

@Injectable({ providedIn: 'root' })
export class ItineraryActivityRoutingResolveService implements Resolve<IItineraryActivity | null> {
  constructor(protected service: ItineraryActivityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItineraryActivity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itineraryActivity: HttpResponse<IItineraryActivity>) => {
          if (itineraryActivity.body) {
            return of(itineraryActivity.body);
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
