import dayjs from 'dayjs/esm';

import { MessageType } from 'app/entities/enumerations/message-type.model';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 29027,
};

export const sampleWithPartialData: IMessage = {
  id: 28491,
  content: 'Oklahoma',
  type: MessageType['RESERVATION'],
  sendTo: 'hack Global Louisiana',
};

export const sampleWithFullData: IMessage = {
  id: 57475,
  content: 'action-items',
  senderName: 'projection',
  type: MessageType['PRIVATE_MESSAGE'],
  sentDate: dayjs('2024-03-04T22:57'),
  sendTo: 'quantify cyan',
};

export const sampleWithNewData: NewMessage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
