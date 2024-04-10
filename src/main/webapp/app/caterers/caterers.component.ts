import { Component, OnInit } from '@angular/core';
import { CaterersService } from './caterers.service';

@Component({
  selector: 'jhi-caterers',
  templateUrl: './caterers.component.html',
  styleUrls: ['./caterers.component.scss'],
})
export class CaterersComponent implements OnInit {
  caterers: any[] = [];
  constructor(private caterersService: CaterersService) {}

  isDarkMode: boolean = false;
  isDarkModeMenu: boolean = false;
  isDarkModeContainer: boolean = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.isDarkModeMenu = !this.isDarkModeMenu;
    this.isDarkModeContainer = !this.isDarkModeContainer;
  }

  ngOnInit(): void {
    const coll: HTMLCollectionOf<Element> = document.getElementsByClassName('collapsible');
    for (let i = 0; i < coll.length; i++) {
      coll[i].addEventListener('click', function (this: HTMLElement) {
        this.classList.toggle('active');
        const content: HTMLElement | null = this.nextElementSibling as HTMLElement;
        if (content.style.display === 'block') {
          content.style.display = 'none';
        } else {
          content.style.display = 'block';
        }
      });
    }

    this.caterersService.DisplayCaterers().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error fetching caterer data:', error);
      }
    );
  }
}
