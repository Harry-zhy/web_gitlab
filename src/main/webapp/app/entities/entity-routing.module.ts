import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'itinerary-date-time',
        data: { pageTitle: 'ItineraryDateTimes' },
        loadChildren: () => import('./itinerary-date-time/itinerary-date-time.module').then(m => m.ItineraryDateTimeModule),
      },
      {
        path: 'itinerary-guest',
        data: { pageTitle: 'ItineraryGuests' },
        loadChildren: () => import('./itinerary-guest/itinerary-guest.module').then(m => m.ItineraryGuestModule),
      },
      {
        path: 'itinerary-caterer',
        data: { pageTitle: 'ItineraryCaterers' },
        loadChildren: () => import('./itinerary-caterer/itinerary-caterer.module').then(m => m.ItineraryCatererModule),
      },
      {
        path: 'itinerary-activity',
        data: { pageTitle: 'ItineraryActivities' },
        loadChildren: () => import('./itinerary-activity/itinerary-activity.module').then(m => m.ItineraryActivityModule),
      },
      {
        path: 'itinerary-venue',
        data: { pageTitle: 'ItineraryVenues' },
        loadChildren: () => import('./itinerary-venue/itinerary-venue.module').then(m => m.ItineraryVenueModule),
      },
      {
        path: 'event-itinerary',
        data: { pageTitle: 'EventItineraries' },
        loadChildren: () => import('./event-itinerary/event-itinerary.module').then(m => m.EventItineraryModule),
      },
      {
        path: 'caterers',
        data: { pageTitle: 'Caterers' },
        loadChildren: () => import('./caterers/caterers.module').then(m => m.CaterersModule),
      },
      {
        path: 'dietary-requirements',
        data: { pageTitle: 'DietaryRequirements' },
        loadChildren: () => import('./dietary-requirements/dietary-requirements.module').then(m => m.DietaryRequirementsModule),
      },
      {
        path: 'cuisine',
        data: { pageTitle: 'Cuisines' },
        loadChildren: () => import('./cuisine/cuisine.module').then(m => m.CuisineModule),
      },
      {
        path: 'itinerary',
        data: { pageTitle: 'Itineraries' },
        loadChildren: () => import('./itinerary/itinerary.module').then(m => m.ItineraryModule),
      },
      {
        path: 'booked-caterer',
        data: { pageTitle: 'BookedCaterers' },
        loadChildren: () => import('./booked-caterer/booked-caterer.module').then(m => m.BookedCatererModule),
      },
      {
        path: 'activity-company',
        data: { pageTitle: 'ActivityCompanies' },
        loadChildren: () => import('./activity-company/activity-company.module').then(m => m.ActivityCompanyModule),
      },
      {
        path: 'booked-activity',
        data: { pageTitle: 'BookedActivities' },
        loadChildren: () => import('./booked-activity/booked-activity.module').then(m => m.BookedActivityModule),
      },
      {
        path: 'activity-self',
        data: { pageTitle: 'ActivitySelves' },
        loadChildren: () => import('./activity-self/activity-self.module').then(m => m.ActivitySelfModule),
      },
      {
        path: 'activity-idea',
        data: { pageTitle: 'ActivityIdeas' },
        loadChildren: () => import('./activity-idea/activity-idea.module').then(m => m.ActivityIdeaModule),
      },
      {
        path: 'activity-saved',
        data: { pageTitle: 'ActivitySaveds' },
        loadChildren: () => import('./activity-saved/activity-saved.module').then(m => m.ActivitySavedModule),
      },
      {
        path: 'activity-image',
        data: { pageTitle: 'ActivityImages' },
        loadChildren: () => import('./activity-image/activity-image.module').then(m => m.ActivityImageModule),
      },
      {
        path: 'activity-contact-details',
        data: { pageTitle: 'ActivityContactDetails' },
        loadChildren: () => import('./activity-contact-details/activity-contact-details.module').then(m => m.ActivityContactDetailsModule),
      },
      {
        path: 'deco-company',
        data: { pageTitle: 'DecoCompanies' },
        loadChildren: () => import('./deco-company/deco-company.module').then(m => m.DecoCompanyModule),
      },
      {
        path: 'deco-images',
        data: { pageTitle: 'DecoImages' },
        loadChildren: () => import('./deco-images/deco-images.module').then(m => m.DecoImagesModule),
      },
      {
        path: 'deco-saved-company',
        data: { pageTitle: 'DecoSavedCompanies' },
        loadChildren: () => import('./deco-saved-company/deco-saved-company.module').then(m => m.DecoSavedCompanyModule),
      },
      {
        path: 'deco-budget',
        data: { pageTitle: 'DecoBudgets' },
        loadChildren: () => import('./deco-budget/deco-budget.module').then(m => m.DecoBudgetModule),
      },
      {
        path: 'deco-themes',
        data: { pageTitle: 'DecoThemes' },
        loadChildren: () => import('./deco-themes/deco-themes.module').then(m => m.DecoThemesModule),
      },
      {
        path: 'deco-saved-theme',
        data: { pageTitle: 'DecoSavedThemes' },
        loadChildren: () => import('./deco-saved-theme/deco-saved-theme.module').then(m => m.DecoSavedThemeModule),
      },
      {
        path: 'deco-contact-details',
        data: { pageTitle: 'DecoContactDetails' },
        loadChildren: () => import('./deco-contact-details/deco-contact-details.module').then(m => m.DecoContactDetailsModule),
      },
      {
        path: 'one-feedback',
        data: { pageTitle: 'OneFeedbacks' },
        loadChildren: () => import('./one-feedback/one-feedback.module').then(m => m.OneFeedbackModule),
      },
      {
        path: 'rating',
        data: { pageTitle: 'Ratings' },
        loadChildren: () => import('./rating/rating.module').then(m => m.RatingModule),
      },
      {
        path: 'feedbacks',
        data: { pageTitle: 'Feedbacks' },
        loadChildren: () => import('./feedbacks/feedbacks.module').then(m => m.FeedbacksModule),
      },
      {
        path: 'intro',
        data: { pageTitle: 'Intros' },
        loadChildren: () => import('./intro/intro.module').then(m => m.IntroModule),
      },
      {
        path: 'questionnaire',
        data: { pageTitle: 'Questionnaires' },
        loadChildren: () => import('./questionnaire/questionnaire.module').then(m => m.QuestionnaireModule),
      },
      {
        path: 'question',
        data: { pageTitle: 'Questions' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'mcq-option',
        data: { pageTitle: 'MCQOptions' },
        loadChildren: () => import('./mcq-option/mcq-option.module').then(m => m.MCQOptionModule),
      },
      {
        path: 'message',
        data: { pageTitle: 'Messages' },
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'Notifications' },
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
      },
      {
        path: 'supplier',
        data: { pageTitle: 'Suppliers' },
        loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
      },
      {
        path: 'venue-information',
        data: { pageTitle: 'VenueInformations' },
        loadChildren: () => import('./venue-information/venue-information.module').then(m => m.VenueInformationModule),
      },
      {
        path: 'ads-management',
        data: { pageTitle: 'AdsManagements' },
        loadChildren: () => import('./ads-management/ads-management.module').then(m => m.AdsManagementModule),
      },
      {
        path: 'business-information',
        data: { pageTitle: 'BusinessInformations' },
        loadChildren: () => import('./business-information/business-information.module').then(m => m.BusinessInformationModule),
      },
      {
        path: 'mock-caterer-entity',
        data: { pageTitle: 'MockCatererEntities' },
        loadChildren: () => import('./mock-caterer-entity/mock-caterer-entity.module').then(m => m.MockCatererEntityModule),
      },
      {
        path: 'mock-venue-entity',
        data: { pageTitle: 'MockVenueEntities' },
        loadChildren: () => import('./mock-venue-entity/mock-venue-entity.module').then(m => m.MockVenueEntityModule),
      },
      {
        path: 'mock-activity-entity',
        data: { pageTitle: 'MockActivityEntities' },
        loadChildren: () => import('./mock-activity-entity/mock-activity-entity.module').then(m => m.MockActivityEntityModule),
      },
      {
        path: 'favourites-list-item',
        data: { pageTitle: 'FavouritesListItems' },
        loadChildren: () => import('./favourites-list-item/favourites-list-item.module').then(m => m.FavouritesListItemModule),
      },
      {
        path: 'favourites-list',
        data: { pageTitle: 'FavouritesLists' },
        loadChildren: () => import('./favourites-list/favourites-list.module').then(m => m.FavouritesListModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'Events' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
