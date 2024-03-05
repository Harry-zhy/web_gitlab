import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItineraryCaterer } from '../itinerary-caterer.model';

@Component({
  selector: 'jhi-itinerary-caterer-detail',
  templateUrl: './itinerary-caterer-detail.component.html',
})
export class ItineraryCatererDetailComponent implements OnInit {
  itineraryCaterer: IItineraryCaterer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itineraryCaterer }) => {
      this.itineraryCaterer = itineraryCaterer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
