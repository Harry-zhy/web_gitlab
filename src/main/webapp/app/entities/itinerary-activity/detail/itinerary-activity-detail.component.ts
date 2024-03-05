import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItineraryActivity } from '../itinerary-activity.model';

@Component({
  selector: 'jhi-itinerary-activity-detail',
  templateUrl: './itinerary-activity-detail.component.html',
})
export class ItineraryActivityDetailComponent implements OnInit {
  itineraryActivity: IItineraryActivity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryActivity }) => {
      this.itineraryActivity = itineraryActivity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
