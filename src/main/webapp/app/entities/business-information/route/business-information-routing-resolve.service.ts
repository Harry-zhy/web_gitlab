import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusinessInformation } from '../business-information.model';
import { BusinessInformationService } from '../service/business-information.service';

@Injectable({ providedIn: 'root' })
export class BusinessInformationRoutingResolveService implements Resolve<IBusinessInformation | null> {
  constructor(protected service: BusinessInformationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBusinessInformation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((businessInformation: HttpResponse<IBusinessInformation>) => {
          if (businessInformation.body) {
            return of(businessInformation.body);
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
