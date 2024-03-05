import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivityContactDetails } from '../activity-contact-details.model';
import { ActivityContactDetailsService } from '../service/activity-contact-details.service';

@Injectable({ providedIn: 'root' })
export class ActivityContactDetailsRoutingResolveService implements Resolve<IActivityContactDetails | null> {
  constructor(protected service: ActivityContactDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivityContactDetails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((activityContactDetails: HttpResponse<IActivityContactDetails>) => {
          if (activityContactDetails.body) {
            return of(activityContactDetails.body);
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
