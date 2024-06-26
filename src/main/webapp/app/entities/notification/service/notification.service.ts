import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { combineLatest, forkJoin, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INotification, NewNotification } from '../notification.model';
import { IMessage } from '../../message/message.model';

export type PartialUpdateNotification = Partial<INotification> & Pick<INotification, 'id'>;

type RestOf<T extends INotification | NewNotification> = Omit<T, 'receivedDate'> & {
  receivedDate?: string | null;
};

export type RestNotification = RestOf<INotification>;

export type NewRestNotification = RestOf<NewNotification>;

export type PartialUpdateRestNotification = RestOf<PartialUpdateNotification>;

export type EntityResponseType = HttpResponse<INotification>;
export type EntityArrayResponseType = HttpResponse<INotification[]>;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notifications');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(notification: NewNotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notification);
    return this.http
      .post<RestNotification>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(notification: INotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notification);
    return this.http
      .put<RestNotification>(`${this.resourceUrl}/${this.getNotificationIdentifier(notification)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(notification: PartialUpdateNotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notification);
    return this.http
      .patch<RestNotification>(`${this.resourceUrl}/${this.getNotificationIdentifier(notification)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestNotification>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestNotification[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNotificationIdentifier(notification: Pick<INotification, 'id'>): number {
    return notification.id;
  }

  compareNotification(o1: Pick<INotification, 'id'> | null, o2: Pick<INotification, 'id'> | null): boolean {
    return o1 && o2 ? this.getNotificationIdentifier(o1) === this.getNotificationIdentifier(o2) : o1 === o2;
  }

  addNotificationToCollectionIfMissing<Type extends Pick<INotification, 'id'>>(
    notificationCollection: Type[],
    ...notificationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const notifications: Type[] = notificationsToCheck.filter(isPresent);
    if (notifications.length > 0) {
      const notificationCollectionIdentifiers = notificationCollection.map(
        notificationItem => this.getNotificationIdentifier(notificationItem)!
      );
      const notificationsToAdd = notifications.filter(notificationItem => {
        const notificationIdentifier = this.getNotificationIdentifier(notificationItem);
        if (notificationCollectionIdentifiers.includes(notificationIdentifier)) {
          return false;
        }
        notificationCollectionIdentifiers.push(notificationIdentifier);
        return true;
      });
      return [...notificationsToAdd, ...notificationCollection];
    }
    return notificationCollection;
  }

  protected convertDateFromClient<T extends INotification | NewNotification | PartialUpdateNotification>(notification: T): RestOf<T> {
    return {
      ...notification,
      receivedDate: notification.receivedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restNotification: RestNotification): INotification {
    return {
      ...restNotification,
      receivedDate: restNotification.receivedDate ? dayjs(restNotification.receivedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestNotification>): HttpResponse<INotification> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestNotification[]>): HttpResponse<INotification[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  private apiUrl = '/api/messages/by-email';

  getNotificationsByEmail(email: string): Observable<INotification[]> {
    const url = `${this.apiUrl}/${email}`;
    return this.http.get<IMessage[]>(url, { observe: 'response' }).pipe(
      switchMap(response => {
        const messages = response.body || [];
        const notificationIds = messages.map(message => message.notification?.id).filter(id => id !== undefined);
        const uniqueNotificationIds = [...new Set(notificationIds)];
        return this.getNotificationsByIds(uniqueNotificationIds);
      })
    );
  }

  getNotificationsByIds(ids: (number | undefined)[]): Observable<INotification[]> {
    const observables: Observable<INotification>[] = ids.map(id => this.getNotificationById(id));
    return combineLatest(observables);
  }

  private getNotificationById(id: number | undefined): Observable<INotification> {
    const url = `/api/notifications/${id}`;
    return this.http.get<INotification>(url);
  }

  updateNotificationStatus(notificationId: number, newStatus: string): Observable<EntityResponseType> {
    // @ts-ignore
    const notification: PartialUpdateNotification = { id: notificationId, status: newStatus };
    return this.update(notification);
  }
}
