import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItineraryDateTime } from '../itinerary-date-time.model';

@Component({
  selector: 'jhi-itinerary-date-time-detail',
  templateUrl: './itinerary-date-time-detail.component.html',
})
export class ItineraryDateTimeDetailComponent implements OnInit {
  itineraryDateTime: IItineraryDateTime | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryDateTime }) => {
      this.itineraryDateTime = itineraryDateTime;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
