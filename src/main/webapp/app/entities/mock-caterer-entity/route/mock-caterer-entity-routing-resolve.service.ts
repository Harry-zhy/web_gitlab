import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMockCatererEntity } from '../mock-caterer-entity.model';
import { MockCatererEntityService } from '../service/mock-caterer-entity.service';

@Injectable({ providedIn: 'root' })
export class MockCatererEntityRoutingResolveService implements Resolve<IMockCatererEntity | null> {
  constructor(protected service: MockCatererEntityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMockCatererEntity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mockCatererEntity: HttpResponse<IMockCatererEntity>) => {
          if (mockCatererEntity.body) {
            return of(mockCatererEntity.body);
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
