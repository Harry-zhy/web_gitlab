import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DecoSavedCompanyComponent } from '../list/deco-saved-company.component';
import { DecoSavedCompanyDetailComponent } from '../detail/deco-saved-company-detail.component';
import { DecoSavedCompanyUpdateComponent } from '../update/deco-saved-company-update.component';
import { DecoSavedCompanyRoutingResolveService } from './deco-saved-company-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const decoSavedCompanyRoute: Routes = [
  {
    path: '',
    component: DecoSavedCompanyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DecoSavedCompanyDetailComponent,
    resolve: {
      decoSavedCompany: DecoSavedCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DecoSavedCompanyUpdateComponent,
    resolve: {
      decoSavedCompany: DecoSavedCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DecoSavedCompanyUpdateComponent,
    resolve: {
      decoSavedCompany: DecoSavedCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(decoSavedCompanyRoute)],
  exports: [RouterModule],
})
export class DecoSavedCompanyRoutingModule {}
