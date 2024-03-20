import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-search-activity-page',
  templateUrl: './search-activity-page.component.html',
  styleUrls: ['./search-activity-page.component.scss'],
})
export class SearchActivityPageComponent implements OnInit {
  constructor(private router: Router) {}

  searchResult() {
    this.router.navigate(['/Result-page']);
  }

  goBack() {
    this.router.navigate(['/venues']);
  }
  ngOnInit(): void {}
}
