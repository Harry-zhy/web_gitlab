import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdsManagement } from '../ads-management.model';

@Component({
  selector: 'jhi-ads-management-detail',
  templateUrl: './ads-management-detail.component.html',
})
export class AdsManagementDetailComponent implements OnInit {
  adsManagement: IAdsManagement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adsManagement }) => {
      this.adsManagement = adsManagement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
