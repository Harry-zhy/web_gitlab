export interface IMockVenueEntity {
  id: number;
  name?: string | null;
  companyName?: string | null;
  location?: string | null;
  rating?: number | null;
  description?: string | null;
  contact?: string | null;
}

export type NewMockVenueEntity = Omit<IMockVenueEntity, 'id'> & { id: null };
