import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventItinerary } from '../event-itinerary.model';

@Component({
  selector: 'jhi-event-itinerary-detail',
  templateUrl: './event-itinerary-detail.component.html',
})
export class EventItineraryDetailComponent implements OnInit {
  eventItinerary: IEventItinerary | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventItinerary }) => {
      this.eventItinerary = eventItinerary;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
