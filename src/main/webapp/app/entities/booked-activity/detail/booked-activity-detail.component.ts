import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBookedActivity } from '../booked-activity.model';

@Component({
  selector: 'jhi-booked-activity-detail',
  templateUrl: './booked-activity-detail.component.html',
})
export class BookedActivityDetailComponent implements OnInit {
  bookedActivity: IBookedActivity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookedActivity }) => {
      this.bookedActivity = bookedActivity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
