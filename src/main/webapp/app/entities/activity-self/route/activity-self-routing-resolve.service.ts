import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivitySelf } from '../activity-self.model';
import { ActivitySelfService } from '../service/activity-self.service';

@Injectable({ providedIn: 'root' })
export class ActivitySelfRoutingResolveService implements Resolve<IActivitySelf | null> {
  constructor(protected service: ActivitySelfService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivitySelf | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((activitySelf: HttpResponse<IActivitySelf>) => {
          if (activitySelf.body) {
            return of(activitySelf.body);
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
