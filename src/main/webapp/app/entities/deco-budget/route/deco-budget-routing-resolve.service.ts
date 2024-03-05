import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDecoBudget } from '../deco-budget.model';
import { DecoBudgetService } from '../service/deco-budget.service';

@Injectable({ providedIn: 'root' })
export class DecoBudgetRoutingResolveService implements Resolve<IDecoBudget | null> {
  constructor(protected service: DecoBudgetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDecoBudget | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((decoBudget: HttpResponse<IDecoBudget>) => {
          if (decoBudget.body) {
            return of(decoBudget.body);
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
