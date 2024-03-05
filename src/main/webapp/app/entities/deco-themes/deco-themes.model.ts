import { IDecoSavedTheme } from 'app/entities/deco-saved-theme/deco-saved-theme.model';

export interface IDecoThemes {
  id: number;
  description?: string | null;
  name?: string | null;
  decoSavedThemes?: Pick<IDecoSavedTheme, 'id'>[] | null;
}

export type NewDecoThemes = Omit<IDecoThemes, 'id'> & { id: null };
