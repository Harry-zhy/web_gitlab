import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDecoImages } from '../deco-images.model';
import { DecoImagesService } from '../service/deco-images.service';

@Injectable({ providedIn: 'root' })
export class DecoImagesRoutingResolveService implements Resolve<IDecoImages | null> {
  constructor(protected service: DecoImagesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDecoImages | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((decoImages: HttpResponse<IDecoImages>) => {
          if (decoImages.body) {
            return of(decoImages.body);
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
