import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDecoSavedTheme } from '../deco-saved-theme.model';
import { DecoSavedThemeService } from '../service/deco-saved-theme.service';

@Injectable({ providedIn: 'root' })
export class DecoSavedThemeRoutingResolveService implements Resolve<IDecoSavedTheme | null> {
  constructor(protected service: DecoSavedThemeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDecoSavedTheme | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((decoSavedTheme: HttpResponse<IDecoSavedTheme>) => {
          if (decoSavedTheme.body) {
            return of(decoSavedTheme.body);
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
