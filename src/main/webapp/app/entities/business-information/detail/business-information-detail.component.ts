import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusinessInformation } from '../business-information.model';

@Component({
  selector: 'jhi-business-information-detail',
  templateUrl: './business-information-detail.component.html',
})
export class BusinessInformationDetailComponent implements OnInit {
  businessInformation: IBusinessInformation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessInformation }) => {
      this.businessInformation = businessInformation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
