import { ICaterers } from 'app/entities/caterers/caterers.model';

export interface IDietaryRequirements {
  id: number;
  option?: string | null;
  caterers?: Pick<ICaterers, 'id'>[] | null;
}

export type NewDietaryRequirements = Omit<IDietaryRequirements, 'id'> & { id: null };
