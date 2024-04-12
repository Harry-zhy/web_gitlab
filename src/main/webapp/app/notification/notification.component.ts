import { Component, OnInit } from '@angular/core';
import { IMessage } from '../entities/message/message.model';
import { INotification } from '../entities/notification/notification.model';
import { MessageService } from '../entities/message/service/message.service';
import { NotificationService } from '../entities/notification/service/notification.service';
import { UserService } from '../entities/user/user.service';
import dayjs from 'dayjs/esm';
import { debounceTime, Subject } from 'rxjs';
import { UserManagementService } from '../admin/user-management/service/user-management.service';

@Component({
  selector: 'jhi-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  messages: IMessage[] = [];
  notifications: INotification[] | undefined = [];
  newMessageContent: string = '';
  selectedMessages: IMessage[] = [];
  notificationIds: number[] = [];
  filteredNotifications: INotification[] = [];
  toggled: boolean = false;
  selectedSVG: string = '';
  protected showCloseButton: boolean = false;
  protected username: string = '';
  usernameChanged: Subject<string> = new Subject<string>();
  protected isUserExist: boolean = false;
  currentUserEmail: string = '';

  constructor(
    private messageService: MessageService,
    private notificationService: NotificationService,
    private userManagementService: UserManagementService,
    private userService: UserService
  ) {
    // this.usernameChanged.pipe(debounceTime(500)).subscribe((username: string) => {
    //   this.checkUser(username);
    // });
  }

  async ngOnInit(): Promise<void> {
    await this.getCurrentUserEmail();
    await this.loadNotificationsByEmail(this.currentUserEmail);
    await this.loadMessages();
    this.showPrivate();
    // this.hasUnreadReplies();
    // this.hasUnreadBookings();
  }

  async getCurrentUserEmail(): Promise<void> {
    try {
      // @ts-ignore
      this.currentUserEmail = await this.userService.getCurrentUserEmail().toPromise();
      console.log('Current user email:', this.currentUserEmail);
    } catch (error) {
      console.error('Error fetching current user email:', error);
      throw error;
    }
  }

  async loadMessages(): Promise<void> {
    const response = await this.messageService.query().toPromise();
    // @ts-ignore
    this.messages = response.body || [];
  }

  async loadNotifications(): Promise<void> {
    const response = await this.notificationService.query().toPromise();
    // @ts-ignore
    this.notifications = (response.body || []).sort((a, b) => {
      // @ts-ignore
      return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
    });
    setTimeout(() => {}, 50);
  }

  async loadNotificationsByEmail(email: string): Promise<void> {
    this.notifications = await this.notificationService.getNotificationsByEmail(email).toPromise();
    // @ts-ignore
    this.notifications = this.notifications.sort((a, b) => {
      // @ts-ignore
      return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
    });
  }

  showMessage(notification: INotification) {
    this.selectedMessages = this.messages.filter(message => message.notification?.id === notification.id);
    if (notification.status?.includes('UN')) {
      this.markNotificationAsRead(notification.id);
    }
    setTimeout(() => {}, 20);

    this.showCloseButton = true;
  }

  closeChat() {
    this.selectedMessages = [];
    this.showCloseButton = false;
  }

  markNotificationAsRead(notificationId: number): void {
    // @ts-ignore
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

  getContent(content: string | undefined | null): string {
    if (content === undefined) {
      return '';
    }
    // @ts-ignore
    return content.split('|')[1]?.trim() || '';
  }

  getSenderName(notification: INotification): string | null | undefined {
    const message = this.messages.find(message => message.notification?.id === notification.id);
    return message?.content?.split('|')[0];
  }

  filterMessagesByType(messages: IMessage[], type: string): number[] {
    const filteredMessages = messages.filter(message => message.type?.includes(type) && message.notification?.id != null);
    return filteredMessages.map(message => message.notification!.id!);
  }

  getNotificationsByIds(notificationIds: number[]): INotification[] {
    // @ts-ignore
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

  // checkUser(username: string) {
  //   this.isUserExist = false;
  //   this.userManagementService.isExist(username).subscribe(exists => {
  //     this.isUserExist = exists;
  //   })
  // }

  sendMessage(): void {
    console.log('aaaaa');
  }

  createMessage(): void {}

  createNotification(): void {}

  shouldShowTime(message: IMessage, index: number): boolean {
    if (index === 0) {
      return true;
    }
    const prevMessage = this.selectedMessages[index - 1];
    // @ts-ignore
    const timeDifference = message.sentDate.diff(prevMessage.sentDate, 'minute');
    return timeDifference > 10;
  }

  protected readonly onkeyup = onkeyup;

  onKeyUp() {
    this.usernameChanged.next(this.username);
  }
}
