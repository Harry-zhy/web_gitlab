import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItinerary } from '../itinerary.model';

@Component({
  selector: 'jhi-itinerary-detail',
  templateUrl: './itinerary-detail.component.html',
})
export class ItineraryDetailComponent implements OnInit {
  itinerary: IItinerary | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itinerary }) => {
      this.itinerary = itinerary;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
