import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMockActivityEntity } from '../mock-activity-entity.model';

@Component({
  selector: 'jhi-mock-activity-entity-detail',
  templateUrl: './mock-activity-entity-detail.component.html',
})
export class MockActivityEntityDetailComponent implements OnInit {
  mockActivityEntity: IMockActivityEntity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mockActivityEntity }) => {
      this.mockActivityEntity = mockActivityEntity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
