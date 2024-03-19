import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-supplier-profile',
  templateUrl: './supplier-profile.component.html',
  styleUrls: ['./supplier-profile.component.scss'],
})
export class SupplierProfileComponent implements OnInit {
  constructor() {}
  name: string[] = [];
  price: number = 0;
  capacity: string[] = [];
  location: string[] = [];
  showVenueExtraInfo = false;
  showCookExtraInfo = false;
  showCampExtraInfo = false;

  ngOnInit(): void {
    // const coll: HTMLCollectionOf<Element> = document.getElementsByClassName('cook-info  ');
    //
    // for (let i = 0; i < coll.length; i++) {
    //   coll[i].addEventListener('click', function (this: HTMLElement) {
    //     this.classList.toggle('active');
    //     const content: HTMLElement | null = this.nextElementSibling as HTMLElement;
    //     if (content.style.display === 'none') {
    //       content.style.display = 'block';
    //     } else {
    //       content.style.display = 'none';
    //     }
    //   });
    // }
  }

  showVenue() {
    this.showVenueExtraInfo = !this.showVenueExtraInfo;
  }
  showCook() {
    this.showCookExtraInfo = !this.showCookExtraInfo;
  }
  showCamp() {
    this.showCampExtraInfo = !this.showCampExtraInfo;
  }
}
