import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDecoSavedCompany } from '../deco-saved-company.model';

@Component({
  selector: 'jhi-deco-saved-company-detail',
  templateUrl: './deco-saved-company-detail.component.html',
})
export class DecoSavedCompanyDetailComponent implements OnInit {
  decoSavedCompany: IDecoSavedCompany | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoSavedCompany }) => {
      this.decoSavedCompany = decoSavedCompany;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
