import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MessageFormService, MessageFormGroup } from './message-form.service';
import { IMessage } from '../message.model';
import { MessageService } from '../service/message.service';
import { INotification } from 'app/entities/notification/notification.model';
import { NotificationService } from 'app/entities/notification/service/notification.service';
import { MessageType } from 'app/entities/enumerations/message-type.model';

@Component({
  selector: 'jhi-message-update',
  templateUrl: './message-update.component.html',
})
export class MessageUpdateComponent implements OnInit {
  isSaving = false;
  message: IMessage | null = null;
  messageTypeValues = Object.keys(MessageType);

  notificationsCollection: INotification[] = [];

  editForm: MessageFormGroup = this.messageFormService.createMessageFormGroup();

  constructor(
    protected messageService: MessageService,
    protected messageFormService: MessageFormService,
    protected notificationService: NotificationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareNotification = (o1: INotification | null, o2: INotification | null): boolean =>
    this.notificationService.compareNotification(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ message }) => {
      this.message = message;
      if (message) {
        this.updateForm(message);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const message = this.messageFormService.getMessage(this.editForm);
    if (message.id !== null) {
      this.subscribeToSaveResponse(this.messageService.update(message));
    } else {
      this.subscribeToSaveResponse(this.messageService.create(message));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(message: IMessage): void {
    this.message = message;
    this.messageFormService.resetForm(this.editForm, message);

    this.notificationsCollection = this.notificationService.addNotificationToCollectionIfMissing<INotification>(
      this.notificationsCollection,
      message.notification
    );
  }

  protected loadRelationshipsOptions(): void {
    this.notificationService
      .query({ filter: 'message-is-null' })
      .pipe(map((res: HttpResponse<INotification[]>) => res.body ?? []))
      .pipe(
        map((notifications: INotification[]) =>
          this.notificationService.addNotificationToCollectionIfMissing<INotification>(notifications, this.message?.notification)
        )
      )
      .subscribe((notifications: INotification[]) => (this.notificationsCollection = notifications));
  }
}
