import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOneFeedback } from '../one-feedback.model';

@Component({
  selector: 'jhi-one-feedback-detail',
  templateUrl: './one-feedback-detail.component.html',
})
export class OneFeedbackDetailComponent implements OnInit {
  oneFeedback: IOneFeedback | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ oneFeedback }) => {
      this.oneFeedback = oneFeedback;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
