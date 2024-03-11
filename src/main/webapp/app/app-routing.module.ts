import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivitiesComponent } from './activities/activities.component';
import { CaterersComponent } from './caterers/caterers.component';
import { VenuesComponent } from './venues/venues.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SupplierProfileComponent } from './supplier-profile/supplier-profile.component';
import { DecorationsComponent } from './decorations/decorations.component';
import { BookedactivitypageComponent } from './bookedactivitypage/bookedactivitypage.component';
import { SelfactivitypageComponent } from './selfactivitypage/selfactivitypage.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'activities',
          component: ActivitiesComponent,
        },
        {
          path: 'caterers',
          component: CaterersComponent,
        },
        {
          path: 'venues',
          component: VenuesComponent,
        },
        {
          path: 'itinerary',
          component: ItineraryComponent,
        },
        {
          path: 'feedback',
          component: FeedbackComponent,
        },
        {
          path: 'notification',
          component: NotificationComponent,
        },
        {
          path: 'userprofile',
          component: UserprofileComponent,
        },
        {
          path: 'supplier-profile',
          component: SupplierProfileComponent,
        },
        {
          path: 'bookactivitypage',
          component: BookedactivitypageComponent,
        },

        {
          path: 'decorations',
          component: DecorationsComponent,
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
