import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss'],
})
export class VenuesComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  searchForVenue: boolean = false;
  startSearch() {
    this.router.navigate(['/search-page1']);
  }

  startAnotherSearch() {
    this.router.navigate(['/search-page2']);
  }
}
