import dayjs from 'dayjs/esm';

import { NotificationStatus } from 'app/entities/enumerations/notification-status.model';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 30621,
};

export const sampleWithPartialData: INotification = {
  id: 64249,
};

export const sampleWithFullData: INotification = {
  id: 55330,
  receivedDate: dayjs('2024-03-04T20:43'),
  status: NotificationStatus['UNREAD'],
};

export const sampleWithNewData: NewNotification = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
