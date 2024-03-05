export interface IDecoContactDetails {
  id: number;
  website?: string | null;
  phoneNumber?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
}

export type NewDecoContactDetails = Omit<IDecoContactDetails, 'id'> & { id: null };
