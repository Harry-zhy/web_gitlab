import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBookedActivity } from '../booked-activity.model';
import { BookedActivityService } from '../service/booked-activity.service';

@Injectable({ providedIn: 'root' })
export class BookedActivityRoutingResolveService implements Resolve<IBookedActivity | null> {
  constructor(protected service: BookedActivityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBookedActivity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bookedActivity: HttpResponse<IBookedActivity>) => {
          if (bookedActivity.body) {
            return of(bookedActivity.body);
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
