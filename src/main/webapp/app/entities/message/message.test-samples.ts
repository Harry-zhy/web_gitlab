import dayjs from 'dayjs/esm';

import { MessageType } from 'app/entities/enumerations/message-type.model';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 29027,
};

export const sampleWithPartialData: IMessage = {
  id: 85938,
  content: 'Metal',
  type: MessageType['PRIVATE_MESSAGE'],
};

export const sampleWithFullData: IMessage = {
  id: 76000,
  content: 'invoice',
  senderName: 'Louisiana Florida B2C',
  type: MessageType['REPLY'],
  sentDate: dayjs('2024-03-04T20:02'),
};

export const sampleWithNewData: NewMessage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
