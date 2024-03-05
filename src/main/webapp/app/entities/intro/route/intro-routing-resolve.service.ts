import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIntro } from '../intro.model';
import { IntroService } from '../service/intro.service';

@Injectable({ providedIn: 'root' })
export class IntroRoutingResolveService implements Resolve<IIntro | null> {
  constructor(protected service: IntroService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIntro | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((intro: HttpResponse<IIntro>) => {
          if (intro.body) {
            return of(intro.body);
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
