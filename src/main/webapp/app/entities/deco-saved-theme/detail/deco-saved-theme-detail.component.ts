import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDecoSavedTheme } from '../deco-saved-theme.model';

@Component({
  selector: 'jhi-deco-saved-theme-detail',
  templateUrl: './deco-saved-theme-detail.component.html',
})
export class DecoSavedThemeDetailComponent implements OnInit {
  decoSavedTheme: IDecoSavedTheme | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoSavedTheme }) => {
      this.decoSavedTheme = decoSavedTheme;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
