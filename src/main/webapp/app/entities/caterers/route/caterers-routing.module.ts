import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CaterersComponent } from '../list/caterers.component';
import { CaterersDetailComponent } from '../detail/caterers-detail.component';
import { CaterersUpdateComponent } from '../update/caterers-update.component';
import { CaterersRoutingResolveService } from './caterers-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const caterersRoute: Routes = [
  {
    path: '',
    component: CaterersComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CaterersDetailComponent,
    resolve: {
      caterers: CaterersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CaterersUpdateComponent,
    resolve: {
      caterers: CaterersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CaterersUpdateComponent,
    resolve: {
      caterers: CaterersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(caterersRoute)],
  exports: [RouterModule],
})
export class CaterersRoutingModule {}
