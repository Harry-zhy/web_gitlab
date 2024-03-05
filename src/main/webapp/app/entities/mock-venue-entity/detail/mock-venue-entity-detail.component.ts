import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMockVenueEntity } from '../mock-venue-entity.model';

@Component({
  selector: 'jhi-mock-venue-entity-detail',
  templateUrl: './mock-venue-entity-detail.component.html',
})
export class MockVenueEntityDetailComponent implements OnInit {
  mockVenueEntity: IMockVenueEntity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mockVenueEntity }) => {
      this.mockVenueEntity = mockVenueEntity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
