export function convertDateColumns<
  T extends {
    createdAt: Date;
    updatedAt: Date;
  }
>(data: T): Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } {
  return {
    ...data,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}
