import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQuestionnaire } from '../questionnaire.model';
import { QuestionnaireService } from '../service/questionnaire.service';

@Injectable({ providedIn: 'root' })
export class QuestionnaireRoutingResolveService implements Resolve<IQuestionnaire | null> {
  constructor(protected service: QuestionnaireService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuestionnaire | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((questionnaire: HttpResponse<IQuestionnaire>) => {
          if (questionnaire.body) {
            return of(questionnaire.body);
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
