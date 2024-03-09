import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

@Component({
  selector: 'jhi-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
})
export class ItineraryComponent implements OnInit {
  constructor() {}

  buttonStates: boolean[] = [false, false, false];
  showInputBox: boolean = false;

  ngOnInit(): void {
    this.toggleOneAtaTime();
  }

  toggleClicked(index: number) {
    this.buttonStates[index] = !this.buttonStates[index];
  }

  toggleOneAtaTime() {
    const guestButtons = document.querySelectorAll('.guestsButton');
    guestButtons.forEach(button => {
      button.addEventListener('click', function () {
        guestButtons.forEach(btn => {
          btn.classList.remove('clicked');
        });
        button.classList.add('clicked');
      });
    });
  }

  toggleGuestsButton(buttonIndex: number): void {
    if (buttonIndex === 2) {
      this.showInputBox = true;
    } else {
      this.showInputBox = false;
    }
  }
}
