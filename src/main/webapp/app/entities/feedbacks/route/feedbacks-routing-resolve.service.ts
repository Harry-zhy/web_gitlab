import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFeedbacks } from '../feedbacks.model';
import { FeedbacksService } from '../service/feedbacks.service';

@Injectable({ providedIn: 'root' })
export class FeedbacksRoutingResolveService implements Resolve<IFeedbacks | null> {
  constructor(protected service: FeedbacksService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFeedbacks | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((feedbacks: HttpResponse<IFeedbacks>) => {
          if (feedbacks.body) {
            return of(feedbacks.body);
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
