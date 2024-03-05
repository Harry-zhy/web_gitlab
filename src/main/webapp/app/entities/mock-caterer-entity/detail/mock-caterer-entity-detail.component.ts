import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMockCatererEntity } from '../mock-caterer-entity.model';

@Component({
  selector: 'jhi-mock-caterer-entity-detail',
  templateUrl: './mock-caterer-entity-detail.component.html',
})
export class MockCatererEntityDetailComponent implements OnInit {
  mockCatererEntity: IMockCatererEntity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mockCatererEntity }) => {
      this.mockCatererEntity = mockCatererEntity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
