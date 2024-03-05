import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdsManagement } from '../ads-management.model';
import { AdsManagementService } from '../service/ads-management.service';

@Injectable({ providedIn: 'root' })
export class AdsManagementRoutingResolveService implements Resolve<IAdsManagement | null> {
  constructor(protected service: AdsManagementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdsManagement | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((adsManagement: HttpResponse<IAdsManagement>) => {
          if (adsManagement.body) {
            return of(adsManagement.body);
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
