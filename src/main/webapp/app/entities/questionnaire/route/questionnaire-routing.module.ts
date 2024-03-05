import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QuestionnaireComponent } from '../list/questionnaire.component';
import { QuestionnaireDetailComponent } from '../detail/questionnaire-detail.component';
import { QuestionnaireUpdateComponent } from '../update/questionnaire-update.component';
import { QuestionnaireRoutingResolveService } from './questionnaire-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const questionnaireRoute: Routes = [
  {
    path: '',
    component: QuestionnaireComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QuestionnaireDetailComponent,
    resolve: {
      questionnaire: QuestionnaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QuestionnaireUpdateComponent,
    resolve: {
      questionnaire: QuestionnaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QuestionnaireUpdateComponent,
    resolve: {
      questionnaire: QuestionnaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(questionnaireRoute)],
  exports: [RouterModule],
})
export class QuestionnaireRoutingModule {}
