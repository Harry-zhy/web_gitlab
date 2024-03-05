import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMCQOption } from '../mcq-option.model';
import { MCQOptionService } from '../service/mcq-option.service';

@Injectable({ providedIn: 'root' })
export class MCQOptionRoutingResolveService implements Resolve<IMCQOption | null> {
  constructor(protected service: MCQOptionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMCQOption | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mCQOption: HttpResponse<IMCQOption>) => {
          if (mCQOption.body) {
            return of(mCQOption.body);
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
