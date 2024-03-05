export interface IMockCatererEntity {
  id: number;
  name?: string | null;
  cuisine?: string | null;
  rating?: number | null;
  description?: string | null;
  quantity?: number | null;
  contact?: string | null;
}

export type NewMockCatererEntity = Omit<IMockCatererEntity, 'id'> & { id: null };
