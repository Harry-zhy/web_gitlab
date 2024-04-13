import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.modalFunc();
  }

  modalFunc() {
    var modal = document.getElementById('infoModal') as HTMLElement;

    // Get the button that opens the modal
    var btn = document.getElementById('expand') as HTMLElement;

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('close')[0] as HTMLElement;

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
      modal.style.display = 'block';
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = 'none';
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
  }
}
