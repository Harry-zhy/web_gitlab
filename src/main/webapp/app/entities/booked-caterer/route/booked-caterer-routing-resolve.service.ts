import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBookedCaterer } from '../booked-caterer.model';
import { BookedCatererService } from '../service/booked-caterer.service';

@Injectable({ providedIn: 'root' })
export class BookedCatererRoutingResolveService implements Resolve<IBookedCaterer | null> {
  constructor(protected service: BookedCatererService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBookedCaterer | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bookedCaterer: HttpResponse<IBookedCaterer>) => {
          if (bookedCaterer.body) {
            return of(bookedCaterer.body);
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
