export interface IIntro {
  id: number;
  title?: string | null;
  salutation?: string | null;
  body?: string | null;
}

export type NewIntro = Omit<IIntro, 'id'> & { id: null };
