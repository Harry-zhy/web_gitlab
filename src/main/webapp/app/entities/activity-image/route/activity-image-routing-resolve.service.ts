import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivityImage } from '../activity-image.model';
import { ActivityImageService } from '../service/activity-image.service';

@Injectable({ providedIn: 'root' })
export class ActivityImageRoutingResolveService implements Resolve<IActivityImage | null> {
  constructor(protected service: ActivityImageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivityImage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((activityImage: HttpResponse<IActivityImage>) => {
          if (activityImage.body) {
            return of(activityImage.body);
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
