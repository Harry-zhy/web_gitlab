import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOneFeedback } from '../one-feedback.model';
import { OneFeedbackService } from '../service/one-feedback.service';

@Injectable({ providedIn: 'root' })
export class OneFeedbackRoutingResolveService implements Resolve<IOneFeedback | null> {
  constructor(protected service: OneFeedbackService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOneFeedback | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((oneFeedback: HttpResponse<IOneFeedback>) => {
          if (oneFeedback.body) {
            return of(oneFeedback.body);
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
