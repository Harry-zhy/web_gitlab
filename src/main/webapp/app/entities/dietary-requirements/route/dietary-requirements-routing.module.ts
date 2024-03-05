import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DietaryRequirementsComponent } from '../list/dietary-requirements.component';
import { DietaryRequirementsDetailComponent } from '../detail/dietary-requirements-detail.component';
import { DietaryRequirementsUpdateComponent } from '../update/dietary-requirements-update.component';
import { DietaryRequirementsRoutingResolveService } from './dietary-requirements-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const dietaryRequirementsRoute: Routes = [
  {
    path: '',
    component: DietaryRequirementsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DietaryRequirementsDetailComponent,
    resolve: {
      dietaryRequirements: DietaryRequirementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DietaryRequirementsUpdateComponent,
    resolve: {
      dietaryRequirements: DietaryRequirementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DietaryRequirementsUpdateComponent,
    resolve: {
      dietaryRequirements: DietaryRequirementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dietaryRequirementsRoute)],
  exports: [RouterModule],
})
export class DietaryRequirementsRoutingModule {}
