import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DecoBudgetComponent } from '../list/deco-budget.component';
import { DecoBudgetDetailComponent } from '../detail/deco-budget-detail.component';
import { DecoBudgetUpdateComponent } from '../update/deco-budget-update.component';
import { DecoBudgetRoutingResolveService } from './deco-budget-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const decoBudgetRoute: Routes = [
  {
    path: '',
    component: DecoBudgetComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DecoBudgetDetailComponent,
    resolve: {
      decoBudget: DecoBudgetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DecoBudgetUpdateComponent,
    resolve: {
      decoBudget: DecoBudgetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DecoBudgetUpdateComponent,
    resolve: {
      decoBudget: DecoBudgetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(decoBudgetRoute)],
  exports: [RouterModule],
})
export class DecoBudgetRoutingModule {}
