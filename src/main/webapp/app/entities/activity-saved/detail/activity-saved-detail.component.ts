import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivitySaved } from '../activity-saved.model';

@Component({
  selector: 'jhi-activity-saved-detail',
  templateUrl: './activity-saved-detail.component.html',
})
export class ActivitySavedDetailComponent implements OnInit {
  activitySaved: IActivitySaved | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activitySaved }) => {
      this.activitySaved = activitySaved;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
