import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFeedbacks } from '../feedbacks.model';

@Component({
  selector: 'jhi-feedbacks-detail',
  templateUrl: './feedbacks-detail.component.html',
})
export class FeedbacksDetailComponent implements OnInit {
  feedbacks: IFeedbacks | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ feedbacks }) => {
      this.feedbacks = feedbacks;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
