import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDecoCompany } from '../deco-company.model';

@Component({
  selector: 'jhi-deco-company-detail',
  templateUrl: './deco-company-detail.component.html',
})
export class DecoCompanyDetailComponent implements OnInit {
  decoCompany: IDecoCompany | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoCompany }) => {
      this.decoCompany = decoCompany;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
