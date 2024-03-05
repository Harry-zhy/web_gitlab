import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DecoThemesComponent } from '../list/deco-themes.component';
import { DecoThemesDetailComponent } from '../detail/deco-themes-detail.component';
import { DecoThemesUpdateComponent } from '../update/deco-themes-update.component';
import { DecoThemesRoutingResolveService } from './deco-themes-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const decoThemesRoute: Routes = [
  {
    path: '',
    component: DecoThemesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DecoThemesDetailComponent,
    resolve: {
      decoThemes: DecoThemesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DecoThemesUpdateComponent,
    resolve: {
      decoThemes: DecoThemesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DecoThemesUpdateComponent,
    resolve: {
      decoThemes: DecoThemesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(decoThemesRoute)],
  exports: [RouterModule],
})
export class DecoThemesRoutingModule {}
