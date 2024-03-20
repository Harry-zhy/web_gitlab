import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  constructor(private router: Router) {}

  searchResult() {
    this.router.navigate(['/Result-page']);
  }

  ngOnInit(): void {}
}
