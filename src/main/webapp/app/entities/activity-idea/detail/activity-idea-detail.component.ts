import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivityIdea } from '../activity-idea.model';

@Component({
  selector: 'jhi-activity-idea-detail',
  templateUrl: './activity-idea-detail.component.html',
})
export class ActivityIdeaDetailComponent implements OnInit {
  activityIdea: IActivityIdea | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityIdea }) => {
      this.activityIdea = activityIdea;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
