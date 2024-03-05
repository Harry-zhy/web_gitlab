import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDecoThemes } from '../deco-themes.model';
import { DecoThemesService } from '../service/deco-themes.service';

@Injectable({ providedIn: 'root' })
export class DecoThemesRoutingResolveService implements Resolve<IDecoThemes | null> {
  constructor(protected service: DecoThemesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDecoThemes | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((decoThemes: HttpResponse<IDecoThemes>) => {
          if (decoThemes.body) {
            return of(decoThemes.body);
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
