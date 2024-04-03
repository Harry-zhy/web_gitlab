import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ItineraryService } from 'app/entities/itinerary/service/itinerary.service';
import { EventItineraryService } from 'app/itinerary/itinerary.service'; // my one

@Component({
  selector: 'jhi-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
})
export class ItineraryComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private http: HttpClient,
    private eventItineraryService: EventItineraryService
  ) {}

  //selected stuffs
  selectedNumberOfGuests: number | null = null;
  selectedGuestsOptionMessage: string = '';
  showMessage: boolean = false;
  ///////

  buttonStates: boolean[] = [false, false, false];
  showInputBox: boolean = false;

  calendar: HTMLElement | null = null;
  selectedDateInput: HTMLInputElement | null = null;
  currentDate: Date = new Date();
  currentMonthName: string = '';
  daysInMonth: (number | null)[] = [];

  currentMonth: number = 0;
  currentYear: number = 0;

  hours: number[] = [];
  minutes: number[] = [];

  startselectedHour: string = '00';
  endselectedHour: string = '00';
  startselectedMinute: string = '00';
  endselectedMinute: string = '00';

  hourOptions: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minuteOptions: string[] = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  activitiesOptions: any[] = [];
  caterersOptions: any[] = [];
  decoratorsOptions: any[] = [];

  ngOnInit(): void {
    //number of guests
    this.toggleOneAtaTime();

    //date and time
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.calendar = document.getElementById('calendar');
    this.selectedDateInput = document.getElementById('selectedDate') as HTMLInputElement;
    this.updateCalendar();
    this.createCalendar(this.currentDate.getFullYear(), this.currentDate.getMonth());
  }

  /////////// im tryna save some lemme land lemme land ////////
  saveNumberOfGuests(numberOfGuests: number): void {
    //HTTP POST request to API?
  }

  selectNumberOfGuests(buttonIndex: number) {
    if (buttonIndex === 2) {
      const inputElement = document.querySelector('.searchTerm') as HTMLInputElement;
      const inputValue = inputElement.value;
      this.selectedNumberOfGuests = inputValue ? parseInt(inputValue, 10) : 0;
    } else {
      this.selectedNumberOfGuests = buttonIndex + 1;
      //console.log(this.selectedNumberOfGuests);
    }
    this.getSelectedGuestsOptionMessage(buttonIndex);
  }

  /*
this.eventItineraryService.createItineraryGuest(this.selectedNumberOfGuests).subscribe(
        () => {
          console.log('Number of Guests Saved');
        },
        (error: any) => {
          console.error('Failed to Save Number of Guests:', error);
        }
      ) */

  //for the display
  getSelectedGuestsOptionMessage(buttonIndex: number): void {
    let gmessage: string;

    if (buttonIndex === 0) {
      gmessage = "You're Expecting 2-5 Guests";
    } else if (buttonIndex === 1) {
      gmessage = "You're Expecting 6-9 Guests";
    } else if (buttonIndex === 2) {
      gmessage = "You're Expecting Over 10 Guests";
      //const inputElement = document.getElementById('.searchTerm') as HTMLInputElement;
      //const numberOfGuests = inputElement.value;
      gmessage = `You're Expecting ${this.selectedNumberOfGuests} Guests`;
    } else {
      gmessage = ' ';
    }

    this.selectedGuestsOptionMessage = gmessage;
    this.showMessage = true;
  }

  toDecorators(): void {
    this.router.navigate(['/decorations']);
  }

  toCaterers(): void {
    this.router.navigate(['/caterersPage']);
  }

  toVenues(): void {
    this.router.navigate(['/venues']);
  }

  toActivities(): void {
    this.router.navigate(['/activities']);
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

  createCalendar(year: number, month: number) {
    this.daysInMonth = []; // clears old dates
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
      this.daysInMonth.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      this.daysInMonth.push(day);
    }
  }

  selectDate(day: number, dayElement: HTMLElement) {
    if (day === null) return;
    const selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    console.log(selectedDate.toDateString());
    const dayElements = document.querySelectorAll('.day');

    const formattedDate = selectedDate.toDateString();
    this.selectedDateInput!.value = formattedDate;

    dayElements.forEach(element => {
      this.renderer.removeClass(element, 'selected');
    });

    this.renderer.addClass(dayElement, 'selected');
  }

  highlightDay(dayElement: HTMLElement) {
    if (!dayElement) return;

    this.renderer.addClass(dayElement, 'highlighted');
  }

  removeHighlight(dayElement: HTMLElement) {
    if (!dayElement) return;

    this.renderer.removeClass(dayElement, 'highlighted');
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.createCalendar(this.currentDate.getFullYear(), this.currentDate.getMonth());
    this.updateCalendar();
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.createCalendar(this.currentDate.getFullYear(), this.currentDate.getMonth());
    this.updateCalendar();
  }

  private updateCalendar() {
    this.currentMonthName = this.getMonthName(this.currentDate.getMonth());
  }

  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[monthIndex];
  }

  submitDateTime(): void {
    const eventTimings: number[] = [];
    eventTimings.push();
  }

  addActivitiesOption() {
    this.activitiesOptions.push({});
  }

  removeActivitiesOption() {
    this.activitiesOptions.shift();
  }

  addCaterersOption() {
    this.caterersOptions.push({});
  }

  removeCaterersOption() {
    this.caterersOptions.shift();
  }

  addDecoratorsOption() {
    this.decoratorsOptions.push({});
  }

  removeDecoratorsOption() {
    this.decoratorsOptions.shift();
  }
}
