import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDecoSavedCompany } from '../deco-saved-company.model';
import { DecoSavedCompanyService } from '../service/deco-saved-company.service';

@Injectable({ providedIn: 'root' })
export class DecoSavedCompanyRoutingResolveService implements Resolve<IDecoSavedCompany | null> {
  constructor(protected service: DecoSavedCompanyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDecoSavedCompany | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((decoSavedCompany: HttpResponse<IDecoSavedCompany>) => {
          if (decoSavedCompany.body) {
            return of(decoSavedCompany.body);
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
