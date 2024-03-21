import dayjs from 'dayjs/esm';
import { INotification } from 'app/entities/notification/notification.model';
import { MessageType } from 'app/entities/enumerations/message-type.model';

export interface IMessage {
  id: number;
  content?: string | null;
  senderName?: string | null;
  type?: MessageType | null;
  sentDate?: dayjs.Dayjs | null;
  sendTo?: string | null;
  notification?: Pick<INotification, 'id'> | null;
}

export type NewMessage = Omit<IMessage, 'id'> & { id: null };
