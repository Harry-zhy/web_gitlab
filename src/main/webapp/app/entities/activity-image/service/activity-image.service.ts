import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivityImage, NewActivityImage } from '../activity-image.model';

export type PartialUpdateActivityImage = Partial<IActivityImage> & Pick<IActivityImage, 'id'>;

export type EntityResponseType = HttpResponse<IActivityImage>;
export type EntityArrayResponseType = HttpResponse<IActivityImage[]>;

@Injectable({ providedIn: 'root' })
export class ActivityImageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activity-images');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(activityImage: NewActivityImage): Observable<EntityResponseType> {
    return this.http.post<IActivityImage>(this.resourceUrl, activityImage, { observe: 'response' });
  }

  update(activityImage: IActivityImage): Observable<EntityResponseType> {
    return this.http.put<IActivityImage>(`${this.resourceUrl}/${this.getActivityImageIdentifier(activityImage)}`, activityImage, {
      observe: 'response',
    });
  }

  partialUpdate(activityImage: PartialUpdateActivityImage): Observable<EntityResponseType> {
    return this.http.patch<IActivityImage>(`${this.resourceUrl}/${this.getActivityImageIdentifier(activityImage)}`, activityImage, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivityImage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivityImage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActivityImageIdentifier(activityImage: Pick<IActivityImage, 'id'>): number {
    return activityImage.id;
  }

  compareActivityImage(o1: Pick<IActivityImage, 'id'> | null, o2: Pick<IActivityImage, 'id'> | null): boolean {
    return o1 && o2 ? this.getActivityImageIdentifier(o1) === this.getActivityImageIdentifier(o2) : o1 === o2;
  }

  addActivityImageToCollectionIfMissing<Type extends Pick<IActivityImage, 'id'>>(
    activityImageCollection: Type[],
    ...activityImagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const activityImages: Type[] = activityImagesToCheck.filter(isPresent);
    if (activityImages.length > 0) {
      const activityImageCollectionIdentifiers = activityImageCollection.map(
        activityImageItem => this.getActivityImageIdentifier(activityImageItem)!
      );
      const activityImagesToAdd = activityImages.filter(activityImageItem => {
        const activityImageIdentifier = this.getActivityImageIdentifier(activityImageItem);
        if (activityImageCollectionIdentifiers.includes(activityImageIdentifier)) {
          return false;
        }
        activityImageCollectionIdentifiers.push(activityImageIdentifier);
        return true;
      });
      return [...activityImagesToAdd, ...activityImageCollection];
    }
    return activityImageCollection;
  }
}
