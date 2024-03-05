import { ICaterers } from 'app/entities/caterers/caterers.model';

export interface ICuisine {
  id: number;
  region?: string | null;
  caterers?: Pick<ICaterers, 'id'>[] | null;
}

export type NewCuisine = Omit<ICuisine, 'id'> & { id: null };
