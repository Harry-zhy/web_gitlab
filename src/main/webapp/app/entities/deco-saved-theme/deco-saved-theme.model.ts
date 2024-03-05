import { IDecoThemes } from 'app/entities/deco-themes/deco-themes.model';

export interface IDecoSavedTheme {
  id: number;
  name?: string | null;
  decoThemes?: Pick<IDecoThemes, 'id'>[] | null;
}

export type NewDecoSavedTheme = Omit<IDecoSavedTheme, 'id'> & { id: null };
