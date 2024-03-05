import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivityContactDetails } from '../activity-contact-details.model';

@Component({
  selector: 'jhi-activity-contact-details-detail',
  templateUrl: './activity-contact-details-detail.component.html',
})
export class ActivityContactDetailsDetailComponent implements OnInit {
  activityContactDetails: IActivityContactDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityContactDetails }) => {
      this.activityContactDetails = activityContactDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
