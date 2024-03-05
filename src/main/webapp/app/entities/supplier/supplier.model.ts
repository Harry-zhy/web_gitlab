export interface ISupplier {
  id: number;
  isSupplier?: boolean | null;
}

export type NewSupplier = Omit<ISupplier, 'id'> & { id: null };
