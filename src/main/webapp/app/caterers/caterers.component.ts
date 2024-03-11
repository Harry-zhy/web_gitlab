import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-caterers',
  templateUrl: './caterers.component.html',
  styleUrls: ['./caterers.component.scss'],
})
export class CaterersComponent implements OnInit {
  constructor() {}

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
  }
}
