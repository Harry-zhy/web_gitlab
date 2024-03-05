import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DecoContactDetailsComponent } from '../list/deco-contact-details.component';
import { DecoContactDetailsDetailComponent } from '../detail/deco-contact-details-detail.component';
import { DecoContactDetailsUpdateComponent } from '../update/deco-contact-details-update.component';
import { DecoContactDetailsRoutingResolveService } from './deco-contact-details-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const decoContactDetailsRoute: Routes = [
  {
    path: '',
    component: DecoContactDetailsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DecoContactDetailsDetailComponent,
    resolve: {
      decoContactDetails: DecoContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DecoContactDetailsUpdateComponent,
    resolve: {
      decoContactDetails: DecoContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DecoContactDetailsUpdateComponent,
    resolve: {
      decoContactDetails: DecoContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(decoContactDetailsRoute)],
  exports: [RouterModule],
})
export class DecoContactDetailsRoutingModule {}
