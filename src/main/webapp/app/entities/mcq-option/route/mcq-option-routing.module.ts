import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MCQOptionComponent } from '../list/mcq-option.component';
import { MCQOptionDetailComponent } from '../detail/mcq-option-detail.component';
import { MCQOptionUpdateComponent } from '../update/mcq-option-update.component';
import { MCQOptionRoutingResolveService } from './mcq-option-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mCQOptionRoute: Routes = [
  {
    path: '',
    component: MCQOptionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MCQOptionDetailComponent,
    resolve: {
      mCQOption: MCQOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MCQOptionUpdateComponent,
    resolve: {
      mCQOption: MCQOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MCQOptionUpdateComponent,
    resolve: {
      mCQOption: MCQOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mCQOptionRoute)],
  exports: [RouterModule],
})
export class MCQOptionRoutingModule {}
