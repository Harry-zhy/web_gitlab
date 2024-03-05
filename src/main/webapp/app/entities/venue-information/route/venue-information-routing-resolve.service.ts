import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVenueInformation } from '../venue-information.model';
import { VenueInformationService } from '../service/venue-information.service';

@Injectable({ providedIn: 'root' })
export class VenueInformationRoutingResolveService implements Resolve<IVenueInformation | null> {
  constructor(protected service: VenueInformationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVenueInformation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((venueInformation: HttpResponse<IVenueInformation>) => {
          if (venueInformation.body) {
            return of(venueInformation.body);
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
