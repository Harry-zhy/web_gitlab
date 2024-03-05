import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FavouritesListComponent } from '../list/favourites-list.component';
import { FavouritesListDetailComponent } from '../detail/favourites-list-detail.component';
import { FavouritesListUpdateComponent } from '../update/favourites-list-update.component';
import { FavouritesListRoutingResolveService } from './favourites-list-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const favouritesListRoute: Routes = [
  {
    path: '',
    component: FavouritesListComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FavouritesListDetailComponent,
    resolve: {
      favouritesList: FavouritesListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FavouritesListUpdateComponent,
    resolve: {
      favouritesList: FavouritesListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FavouritesListUpdateComponent,
    resolve: {
      favouritesList: FavouritesListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(favouritesListRoute)],
  exports: [RouterModule],
})
export class FavouritesListRoutingModule {}
