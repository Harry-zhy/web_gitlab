import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivityIdea } from '../activity-idea.model';
import { ActivityIdeaService } from '../service/activity-idea.service';

@Injectable({ providedIn: 'root' })
export class ActivityIdeaRoutingResolveService implements Resolve<IActivityIdea | null> {
  constructor(protected service: ActivityIdeaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivityIdea | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((activityIdea: HttpResponse<IActivityIdea>) => {
          if (activityIdea.body) {
            return of(activityIdea.body);
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
