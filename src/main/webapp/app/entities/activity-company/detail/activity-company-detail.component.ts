import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivityCompany } from '../activity-company.model';

@Component({
  selector: 'jhi-activity-company-detail',
  templateUrl: './activity-company-detail.component.html',
})
export class ActivityCompanyDetailComponent implements OnInit {
  activityCompany: IActivityCompany | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityCompany }) => {
      this.activityCompany = activityCompany;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
