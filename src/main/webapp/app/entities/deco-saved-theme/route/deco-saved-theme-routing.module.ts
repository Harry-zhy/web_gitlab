import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DecoSavedThemeComponent } from '../list/deco-saved-theme.component';
import { DecoSavedThemeDetailComponent } from '../detail/deco-saved-theme-detail.component';
import { DecoSavedThemeUpdateComponent } from '../update/deco-saved-theme-update.component';
import { DecoSavedThemeRoutingResolveService } from './deco-saved-theme-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const decoSavedThemeRoute: Routes = [
  {
    path: '',
    component: DecoSavedThemeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DecoSavedThemeDetailComponent,
    resolve: {
      decoSavedTheme: DecoSavedThemeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DecoSavedThemeUpdateComponent,
    resolve: {
      decoSavedTheme: DecoSavedThemeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DecoSavedThemeUpdateComponent,
    resolve: {
      decoSavedTheme: DecoSavedThemeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(decoSavedThemeRoute)],
  exports: [RouterModule],
})
export class DecoSavedThemeRoutingModule {}
