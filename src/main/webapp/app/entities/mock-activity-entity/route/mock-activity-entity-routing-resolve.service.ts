import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMockActivityEntity } from '../mock-activity-entity.model';
import { MockActivityEntityService } from '../service/mock-activity-entity.service';

@Injectable({ providedIn: 'root' })
export class MockActivityEntityRoutingResolveService implements Resolve<IMockActivityEntity | null> {
  constructor(protected service: MockActivityEntityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMockActivityEntity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mockActivityEntity: HttpResponse<IMockActivityEntity>) => {
          if (mockActivityEntity.body) {
            return of(mockActivityEntity.body);
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
