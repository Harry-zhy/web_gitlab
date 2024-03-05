import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventItinerary } from '../event-itinerary.model';
import { EventItineraryService } from '../service/event-itinerary.service';

@Injectable({ providedIn: 'root' })
export class EventItineraryRoutingResolveService implements Resolve<IEventItinerary | null> {
  constructor(protected service: EventItineraryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventItinerary | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventItinerary: HttpResponse<IEventItinerary>) => {
          if (eventItinerary.body) {
            return of(eventItinerary.body);
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
