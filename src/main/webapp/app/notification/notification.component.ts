import { Component, OnInit } from '@angular/core';
import { IMessage, NewMessage } from '../entities/message/message.model';
import { INotification, NewNotification } from '../entities/notification/notification.model';
import { MessageService } from '../entities/message/service/message.service';
import { NotificationService } from '../entities/notification/service/notification.service';
import dayjs from 'dayjs/esm';
import { MessageType } from '../entities/enumerations/message-type.model';
import { NotificationStatus } from '../entities/enumerations/notification-status.model';

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

  async ngOnInit(): Promise<void> {
    await this.loadMessages();
    await this.loadNotifications();
    this.showPrivate();
    // this.hasUnreadReplies();
    // this.hasUnreadBookings();
  }

  async loadMessages(): Promise<void> {
    const response = await this.messageService.query().toPromise();
    // @ts-ignore
    this.messages = response.body || [];

    // this.messages = [
    //   {
    //     id: 1,
    //     content: 'Hello, this is a message',
    //     senderName: 'John Doe',
    //     type: MessageType.PRIVATE_MESSAGE,
    //     sentDate: dayjs('2024-03-19 12:23:31'),
    //     notification: { id: 1 }
    //   },
    //   {
    //     id: 2,
    //     content: 'Hello, how are you',
    //     senderName: 'Vincent J',
    //     type: MessageType.REPLY,
    //     sentDate: dayjs('2024-03-18 14:12:41'),
    //     notification: { id: 2 }
    //   },
    //   {
    //     id: 3,
    //     content: 'sanoigovosvsihdiosf',
    //     senderName: '123321',
    //     type: MessageType.RESERVATION,
    //     sentDate: dayjs('2024-03-15 17:12:32'),
    //     notification: { id: 3 }
    //   },
    //   {
    //     id: 4,
    //     content: 'Welcome to this web',
    //     senderName: 'Admin',
    //     type: MessageType.PRIVATE_MESSAGE,
    //     sentDate: dayjs('2024-03-15 17:12:32'),
    //     notification: { id: 4 }
    //   },
    //   {
    //     id: 5,
    //     content: 'thanks for sending message',
    //     senderName: 'Max',
    //     type: MessageType.REPLY,
    //     sentDate: dayjs('2024-03-15 17:12:32'),
    //     notification: { id: 5 }
    //   },
    //   {
    //     id: 6,
    //     content: 'here is a booking info',
    //     senderName: 'xx hotel',
    //     type: MessageType.RESERVATION,
    //     sentDate: dayjs('2024-03-15 17:12:32'),
    //     notification: { id: 6 }
    //   },
    // ];
  }

  async loadNotifications(): Promise<void> {
    const response = await this.notificationService.query().toPromise();
    // @ts-ignore
    this.notifications = (response.body || []).sort((a, b) => {
      // @ts-ignore
      return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
    });
    setTimeout(() => {}, 50);
    // this.notifications = [
    //   {
    //     id: 1,
    //     receivedDate: dayjs('2024-03-19 12:23:31'),
    //     status: NotificationStatus.READ,
    //   },
    //
    //   {
    //     id: 2,
    //     receivedDate: dayjs('2024-03-18 14:12:41'),
    //     status: NotificationStatus.UNREAD,
    //   },
    //
    //   {
    //     id: 3,
    //     receivedDate: dayjs('2024-03-15 17:12:32'),
    //     status: NotificationStatus.UNREAD,
    //   },
    //
    //   {
    //     id: 4,
    //     receivedDate: dayjs('2024-03-10 17:12:32'),
    //     status: NotificationStatus.UNREAD,
    //   },
    //
    //   {
    //     id: 5,
    //     receivedDate: dayjs('2024-03-05 16:42:32'),
    //     status: NotificationStatus.UNREAD,
    //   },
    //
    //   {
    //     id: 6,
    //     receivedDate: dayjs('2024-03-01 19:32:12'),
    //     status: NotificationStatus.READ,
    //   },
    // ];
  }

  sendMessage(): void {}

  createMessage(): void {}

  createNotification(): void {}

  showMessage(notification: INotification) {
    this.selectedMessages = this.messages.filter(message => message.id === notification.id);
    if (notification.status?.includes('UN')) {
      this.markNotificationAsRead(notification.id);
    }
    setTimeout(() => {}, 20);
  }

  markNotificationAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    // @ts-ignore
    notification.status = 'READ';
  }

  formatTheDate(date: dayjs.Dayjs | null | undefined): string {
    const currentDate = new Date();
    // @ts-ignore
    const receivedDate = new Date(date);
    const currentDayOfWeek = currentDate.getDay();
    const receivedDayOfWeek = receivedDate.getDay();

    const diffDays = Math.floor((currentDate.getTime() - receivedDate.getTime()) / (1000 * 3600 * 24));
    const diffYears = currentDate.getFullYear() - receivedDate.getFullYear();

    if (diffDays === 0) {
      return receivedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays < currentDayOfWeek) {
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
    setTimeout(() => {}, 100);
    this.notificationIds = this.filterMessagesByType(this.messages, 'PRIVATE_MESSAGE');
    this.filteredNotifications = this.getNotificationsByIds(this.notificationIds);
    this.toggled = false;
    this.selectedSVG = '';
  }

  hasUnreadMessages(type: string): boolean {
    const ids = this.filterMessagesByType(this.messages, type);
    const notis = this.getNotificationsByIds(ids);
    return notis.some(notification => notification.status?.includes('UN'));
  }

  shouldShowTime(message: IMessage, index: number): boolean {
    if (index === 0) {
      return true;
    }
    const prevMessage = this.selectedMessages[index - 1];
    // @ts-ignore
    const timeDifference = message.sentDate.diff(prevMessage.sentDate, 'minute');
    return timeDifference > 10;
  }
}
