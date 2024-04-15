import { Component, OnInit, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { DecorationsService } from './decorations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-decorations',
  templateUrl: './decorations.component.html',
  styleUrls: ['./decorations.component.scss'],
})
export class DecorationsComponent implements OnInit {
  @ViewChild('company-slider div') carousel!: ElementRef;
  companies: any[] = [
    { id: 1, name: 'Elite Embellishments', imageUrl: 'content/images/decorationsimages/elite.png' },
    { id: 2, name: 'Oasis Creations', imageUrl: 'content/images/decorationsimages/oasis.png' },
    { id: 3, name: 'Elegant Arts', imageUrl: 'content/images/decorationsimages/elegant.png' },
    { id: 4, name: 'Soiree Celebrations', imageUrl: 'content/images/decorationsimages/soiree.png' },
    { id: 5, name: 'InStyle', imageUrl: 'content/images/decorationsimages/instyle.png' },
    { id: 6, name: 'Decordè de Mode', imageUrl: 'content/images/decorationsimages/decorde.png' },
    { id: 7, name: 'Divine Decor', imageUrl: 'content/images/decorationsimages/divinedecor.png' },
    { id: 8, name: 'ForTheOccasion', imageUrl: 'content/images/decorationsimages/fortheoccasion.png' },
    { id: 9, name: 'Aritz', imageUrl: 'content/images/decorationsimages/Image8.png' },
    { id: 10, name: 'Celebra', imageUrl: 'content/images/decorationsimages/celebra.png' },
    { id: 11, name: 'Carizma', imageUrl: 'content/images/decorationsimages/carizma.png' },
    { id: 12, name: 'Enigma', imageUrl: 'content/images/decorationsimages/enigma.png' },
  ];
  currentItems: { name: string; imageUrl: string }[] = [];

  currentIndex = 0;
  itemsPerPage = 6;
  itemWidth = 200;
  // private dataService: DecorationsService
  constructor(private router: Router) {
    this.showCurrentItems();
  }

  showCurrentItems() {
    this.currentItems = this.companies.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    const totalWidth = this.itemsPerPage * this.itemWidth;
    const transformValue = -this.currentIndex * totalWidth;
  }

  showNext() {
    this.currentIndex += this.itemsPerPage;
    if (this.currentIndex >= this.companies.length) {
      this.currentIndex = 0;
    }
    this.showCurrentItems();
    console.log('showNext() function is being called');
  }

  showPrevious() {
    this.currentIndex -= this.itemsPerPage;
    if (this.currentIndex < 0) {
      this.currentIndex = this.companies.length - this.itemsPerPage;
    }
    this.showCurrentItems();
    console.log('showPrevious() function is being called');
  }
  navigateToCompanyInfo(company: any) {
    this.router.navigate(['/company-info', company.id]);
  }
  companyInfo1() {
    this.router.navigateByUrl('/companyinfopage');
  }
  // fetchCompanies() {
  //   this.dataService.getCompanies().subscribe(
  //     (data) => {
  //       this.companies = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching companies:', error);
  //     }
  //   );
  // }

  ngOnInit(): void {
    //   this.fetchCompanies();
  }
}
