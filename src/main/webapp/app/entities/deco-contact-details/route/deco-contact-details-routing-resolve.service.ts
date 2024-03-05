import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDecoContactDetails } from '../deco-contact-details.model';
import { DecoContactDetailsService } from '../service/deco-contact-details.service';

@Injectable({ providedIn: 'root' })
export class DecoContactDetailsRoutingResolveService implements Resolve<IDecoContactDetails | null> {
  constructor(protected service: DecoContactDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDecoContactDetails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((decoContactDetails: HttpResponse<IDecoContactDetails>) => {
          if (decoContactDetails.body) {
            return of(decoContactDetails.body);
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
