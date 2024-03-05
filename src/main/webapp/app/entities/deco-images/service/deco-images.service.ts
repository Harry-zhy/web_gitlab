import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecoImages, NewDecoImages } from '../deco-images.model';

export type PartialUpdateDecoImages = Partial<IDecoImages> & Pick<IDecoImages, 'id'>;

export type EntityResponseType = HttpResponse<IDecoImages>;
export type EntityArrayResponseType = HttpResponse<IDecoImages[]>;

@Injectable({ providedIn: 'root' })
export class DecoImagesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deco-images');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decoImages: NewDecoImages): Observable<EntityResponseType> {
    return this.http.post<IDecoImages>(this.resourceUrl, decoImages, { observe: 'response' });
  }

  update(decoImages: IDecoImages): Observable<EntityResponseType> {
    return this.http.put<IDecoImages>(`${this.resourceUrl}/${this.getDecoImagesIdentifier(decoImages)}`, decoImages, {
      observe: 'response',
    });
  }

  partialUpdate(decoImages: PartialUpdateDecoImages): Observable<EntityResponseType> {
    return this.http.patch<IDecoImages>(`${this.resourceUrl}/${this.getDecoImagesIdentifier(decoImages)}`, decoImages, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecoImages>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecoImages[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecoImagesIdentifier(decoImages: Pick<IDecoImages, 'id'>): number {
    return decoImages.id;
  }

  compareDecoImages(o1: Pick<IDecoImages, 'id'> | null, o2: Pick<IDecoImages, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecoImagesIdentifier(o1) === this.getDecoImagesIdentifier(o2) : o1 === o2;
  }

  addDecoImagesToCollectionIfMissing<Type extends Pick<IDecoImages, 'id'>>(
    decoImagesCollection: Type[],
    ...decoImagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decoImages: Type[] = decoImagesToCheck.filter(isPresent);
    if (decoImages.length > 0) {
      const decoImagesCollectionIdentifiers = decoImagesCollection.map(decoImagesItem => this.getDecoImagesIdentifier(decoImagesItem)!);
      const decoImagesToAdd = decoImages.filter(decoImagesItem => {
        const decoImagesIdentifier = this.getDecoImagesIdentifier(decoImagesItem);
        if (decoImagesCollectionIdentifiers.includes(decoImagesIdentifier)) {
          return false;
        }
        decoImagesCollectionIdentifiers.push(decoImagesIdentifier);
        return true;
      });
      return [...decoImagesToAdd, ...decoImagesCollection];
    }
    return decoImagesCollection;
  }
}
