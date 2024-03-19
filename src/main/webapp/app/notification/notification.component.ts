import { Component, OnInit } from '@angular/core';
import { IMessage, NewMessage } from '../entities/message/message.model';
import { INotification, NewNotification } from '../entities/notification/notification.model';
import { MessageService } from '../entities/message/service/message.service';
import { NotificationService } from '../entities/notification/service/notification.service';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  messages: IMessage[] = [];
  notifications: INotification[] = [];
  newMessageContent: string = '';
  selectedMessages: IMessage[] = [];
  notificationIds: number[] = [];
  filteredNotifications: INotification[] = [];
  toggled: boolean = false;
  selectedSVG: string = '';

  constructor(private messageService: MessageService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.loadNotifications();
  }

  loadMessages(): void {
    this.messageService.query().subscribe(Response => {
      this.messages = Response.body || [];
    });
  }

  loadNotifications(): void {
    this.notificationService.query().subscribe(Response => {
      this.notifications = (Response.body || []).sort((a, b) => {
        // @ts-ignore
        return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
      });
    });
  }

  sendMessage(): void {
    if (this.newMessageContent.trim() === '') {
      return;
    }
    console.log(this.newMessageContent);

    const newMessage: NewMessage = { id: null, content: this.newMessageContent };
    this.messageService.create(newMessage).subscribe(() => {
      this.loadMessages();
      this.newMessageContent = '';
    });
  }

  markNotificationAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      // @ts-ignore
      notification.status = 'Read';
    }
  }

  createMessage(): void {
    const newMessage: NewMessage = { id: null, content: 'New message content' };
    this.messageService.create(newMessage).subscribe(() => {
      this.loadMessages();
    });
  }

  createNotification(): void {
    // @ts-ignore
    const newNotification: NewNotification = { status: 'Unread' };
    this.notificationService.create(newNotification).subscribe(() => {
      this.loadNotifications();
    });
  }

  showMessage(notification: INotification) {
    this.selectedMessages = this.messages.filter(message => message.id === notification.id);
  }

  formatTheDate(date: dayjs.Dayjs | null | undefined): string {
    const currentDate = new Date();
    // @ts-ignore
    const receivedDate = new Date(date);
    const diffDays = Math.floor((currentDate.getTime() - receivedDate.getTime()) / (1000 * 3600 * 24));
    const diffYears = currentDate.getFullYear() - receivedDate.getFullYear();

    if (diffDays === 0) {
      return receivedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays < 7) {
      return receivedDate.toLocaleDateString('en-US', { weekday: 'long' });
    } else if (diffYears === 0) {
      return receivedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } else {
      return receivedDate.toLocaleTimeString('en-US');
    }
  }

  getSenderName(notification: INotification): string {
    const message = this.messages.find(message => message.id === notification.id);
    return message ? message.senderName || 'Unknown' : 'Unknown';
  }

  filterMessagesByType(messages: IMessage[], type: string): number[] {
    const filteredMessages = messages.filter(message => message.type?.includes(type) && message.notification?.id != null);
    return filteredMessages.map(message => message.notification!.id!);
  }

  getNotificationsByIds(notificationIds: number[]): INotification[] {
    return this.notifications.filter(notification => notificationIds.includes(notification.id));
  }

  toggleReplies() {
    this.notificationIds = this.filterMessagesByType(this.messages, 'REPLY');
    this.filteredNotifications = this.getNotificationsByIds(this.notificationIds);
    this.toggled = true;
    this.selectedSVG = 'replies';
  }

  toggleBookings() {
    this.notificationIds = this.filterMessagesByType(this.messages, 'RESERVATION');
    this.filteredNotifications = this.getNotificationsByIds(this.notificationIds);
    this.toggled = true;
    this.selectedSVG = 'bookings';
  }

  showPrivate() {
    this.notificationIds = this.filterMessagesByType(this.messages, 'PRIVATE_MESSAGE');
    this.filteredNotifications = this.getNotificationsByIds(this.notificationIds);
    this.toggled = false;
    this.selectedSVG = '';
  }
}
