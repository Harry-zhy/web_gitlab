import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMockVenueEntity } from '../mock-venue-entity.model';
import { MockVenueEntityService } from '../service/mock-venue-entity.service';

@Injectable({ providedIn: 'root' })
export class MockVenueEntityRoutingResolveService implements Resolve<IMockVenueEntity | null> {
  constructor(protected service: MockVenueEntityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMockVenueEntity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mockVenueEntity: HttpResponse<IMockVenueEntity>) => {
          if (mockVenueEntity.body) {
            return of(mockVenueEntity.body);
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
