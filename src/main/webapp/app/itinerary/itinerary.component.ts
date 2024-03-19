import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgModule } from '@angular/core';

@Component({
  selector: 'jhi-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
})
export class ItineraryComponent implements OnInit {
  constructor(private renderer: Renderer2) {
    this.initializeTimeOptions();
  }

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
  selectedHour: number = 0;
  selectedMinute: number = 0;

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

  initializeTimeOptions() {
    for (let i = 1; i < 24; i++) {
      this.hours.push(i);
    }
    for (let i = 0; i < 60; i += 5) {
      this.minutes.push(i);
    }
  }
}
