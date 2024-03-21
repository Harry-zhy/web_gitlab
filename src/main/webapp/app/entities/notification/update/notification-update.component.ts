import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NotificationFormService, NotificationFormGroup } from './notification-form.service';
import { INotification } from '../notification.model';
import { NotificationService } from '../service/notification.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { IMessage } from 'app/entities/message/message.model';
import { MessageService } from 'app/entities/message/service/message.service';
import { NotificationStatus } from 'app/entities/enumerations/notification-status.model';

@Component({
  selector: 'jhi-notification-update',
  templateUrl: './notification-update.component.html',
})
export class NotificationUpdateComponent implements OnInit {
  isSaving = false;
  notification: INotification | null = null;
  notificationStatusValues = Object.keys(NotificationStatus);

  suppliersCollection: ISupplier[] = [];
  messagesCollection: IMessage[] = [];

  editForm: NotificationFormGroup = this.notificationFormService.createNotificationFormGroup();

  constructor(
    protected notificationService: NotificationService,
    protected notificationFormService: NotificationFormService,
    protected supplierService: SupplierService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  compareMessage = (o1: IMessage | null, o2: IMessage | null): boolean => this.messageService.compareMessage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notification }) => {
      this.notification = notification;
      if (notification) {
        this.updateForm(notification);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notification = this.notificationFormService.getNotification(this.editForm);
    if (notification.id !== null) {
      this.subscribeToSaveResponse(this.notificationService.update(notification));
    } else {
      this.subscribeToSaveResponse(this.notificationService.create(notification));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotification>>): void {
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

  protected updateForm(notification: INotification): void {
    this.notification = notification;
    this.notificationFormService.resetForm(this.editForm, notification);

    this.suppliersCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersCollection,
      notification.supplier
    );
    this.messagesCollection = this.messageService.addMessageToCollectionIfMissing<IMessage>(this.messagesCollection, notification.message);
  }

  protected loadRelationshipsOptions(): void {
    this.supplierService
      .query({ filter: 'notification-is-null' })
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.notification?.supplier)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersCollection = suppliers));

    this.messageService
      .query({ filter: 'notification-is-null' })
      .pipe(map((res: HttpResponse<IMessage[]>) => res.body ?? []))
      .pipe(
        map((messages: IMessage[]) => this.messageService.addMessageToCollectionIfMissing<IMessage>(messages, this.notification?.message))
      )
      .subscribe((messages: IMessage[]) => (this.messagesCollection = messages));
  }
}
