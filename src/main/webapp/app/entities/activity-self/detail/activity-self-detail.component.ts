import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivitySelf } from '../activity-self.model';

@Component({
  selector: 'jhi-activity-self-detail',
  templateUrl: './activity-self-detail.component.html',
})
export class ActivitySelfDetailComponent implements OnInit {
  activitySelf: IActivitySelf | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activitySelf }) => {
      this.activitySelf = activitySelf;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
