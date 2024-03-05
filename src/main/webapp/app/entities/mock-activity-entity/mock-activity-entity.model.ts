export interface IMockActivityEntity {
  id: number;
  name?: string | null;
  companyName?: string | null;
  rating?: number | null;
  description?: string | null;
  quantity?: number | null;
  contact?: string | null;
}

export type NewMockActivityEntity = Omit<IMockActivityEntity, 'id'> & { id: null };
