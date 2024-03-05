import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivitySaved } from '../activity-saved.model';
import { ActivitySavedService } from '../service/activity-saved.service';

@Injectable({ providedIn: 'root' })
export class ActivitySavedRoutingResolveService implements Resolve<IActivitySaved | null> {
  constructor(protected service: ActivitySavedService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivitySaved | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((activitySaved: HttpResponse<IActivitySaved>) => {
          if (activitySaved.body) {
            return of(activitySaved.body);
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
