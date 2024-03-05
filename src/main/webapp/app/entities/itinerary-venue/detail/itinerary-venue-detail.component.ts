import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItineraryVenue } from '../itinerary-venue.model';

@Component({
  selector: 'jhi-itinerary-venue-detail',
  templateUrl: './itinerary-venue-detail.component.html',
})
export class ItineraryVenueDetailComponent implements OnInit {
  itineraryVenue: IItineraryVenue | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryVenue }) => {
      this.itineraryVenue = itineraryVenue;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
