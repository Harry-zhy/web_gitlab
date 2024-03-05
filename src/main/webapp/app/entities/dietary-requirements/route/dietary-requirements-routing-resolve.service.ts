import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDietaryRequirements } from '../dietary-requirements.model';
import { DietaryRequirementsService } from '../service/dietary-requirements.service';

@Injectable({ providedIn: 'root' })
export class DietaryRequirementsRoutingResolveService implements Resolve<IDietaryRequirements | null> {
  constructor(protected service: DietaryRequirementsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDietaryRequirements | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((dietaryRequirements: HttpResponse<IDietaryRequirements>) => {
          if (dietaryRequirements.body) {
            return of(dietaryRequirements.body);
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
