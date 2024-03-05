import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDecoBudget } from '../deco-budget.model';

@Component({
  selector: 'jhi-deco-budget-detail',
  templateUrl: './deco-budget-detail.component.html',
})
export class DecoBudgetDetailComponent implements OnInit {
  decoBudget: IDecoBudget | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoBudget }) => {
      this.decoBudget = decoBudget;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
