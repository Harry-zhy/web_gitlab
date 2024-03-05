import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDecoCompany } from '../deco-company.model';
import { DecoCompanyService } from '../service/deco-company.service';

@Injectable({ providedIn: 'root' })
export class DecoCompanyRoutingResolveService implements Resolve<IDecoCompany | null> {
  constructor(protected service: DecoCompanyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDecoCompany | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((decoCompany: HttpResponse<IDecoCompany>) => {
          if (decoCompany.body) {
            return of(decoCompany.body);
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
