import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-companyinfopage',
  templateUrl: './companyinfo.component.html',
  styleUrls: ['./companyinfo.component.scss'],
})
export class CompanyinfoComponent implements OnInit {
  constructor(private router: Router) {}

  toDecor() {
    this.router.navigate(['/decorations-page']);
  }
  ngOnInit(): void {}
}
