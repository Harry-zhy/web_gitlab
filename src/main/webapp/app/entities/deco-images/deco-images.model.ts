import { IDecoThemes } from 'app/entities/deco-themes/deco-themes.model';
import { IDecoCompany } from 'app/entities/deco-company/deco-company.model';

export interface IDecoImages {
  id: number;
  picture?: string | null;
  pictureContentType?: string | null;
  decoThemes?: Pick<IDecoThemes, 'id'> | null;
  decoCompany?: Pick<IDecoCompany, 'id'> | null;
}

export type NewDecoImages = Omit<IDecoImages, 'id'> & { id: null };
