import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItineraryGuest } from '../itinerary-guest.model';

@Component({
  selector: 'jhi-itinerary-guest-detail',
  templateUrl: './itinerary-guest-detail.component.html',
})
export class ItineraryGuestDetailComponent implements OnInit {
  itineraryGuest: IItineraryGuest | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryGuest }) => {
      this.itineraryGuest = itineraryGuest;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
