import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivityCompany } from '../activity-company.model';
import { ActivityCompanyService } from '../service/activity-company.service';

@Injectable({ providedIn: 'root' })
export class ActivityCompanyRoutingResolveService implements Resolve<IActivityCompany | null> {
  constructor(protected service: ActivityCompanyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivityCompany | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((activityCompany: HttpResponse<IActivityCompany>) => {
          if (activityCompany.body) {
            return of(activityCompany.body);
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
