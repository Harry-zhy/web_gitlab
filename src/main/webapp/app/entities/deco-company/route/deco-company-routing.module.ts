import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DecoCompanyComponent } from '../list/deco-company.component';
import { DecoCompanyDetailComponent } from '../detail/deco-company-detail.component';
import { DecoCompanyUpdateComponent } from '../update/deco-company-update.component';
import { DecoCompanyRoutingResolveService } from './deco-company-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const decoCompanyRoute: Routes = [
  {
    path: '',
    component: DecoCompanyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DecoCompanyDetailComponent,
    resolve: {
      decoCompany: DecoCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DecoCompanyUpdateComponent,
    resolve: {
      decoCompany: DecoCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DecoCompanyUpdateComponent,
    resolve: {
      decoCompany: DecoCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(decoCompanyRoute)],
  exports: [RouterModule],
})
export class DecoCompanyRoutingModule {}
