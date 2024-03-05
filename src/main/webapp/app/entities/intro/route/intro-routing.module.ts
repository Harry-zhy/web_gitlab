import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IntroComponent } from '../list/intro.component';
import { IntroDetailComponent } from '../detail/intro-detail.component';
import { IntroUpdateComponent } from '../update/intro-update.component';
import { IntroRoutingResolveService } from './intro-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const introRoute: Routes = [
  {
    path: '',
    component: IntroComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IntroDetailComponent,
    resolve: {
      intro: IntroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IntroUpdateComponent,
    resolve: {
      intro: IntroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IntroUpdateComponent,
    resolve: {
      intro: IntroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(introRoute)],
  exports: [RouterModule],
})
export class IntroRoutingModule {}
