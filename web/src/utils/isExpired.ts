export const isExpired = (term: string) => {
  const termDate = new Date(term);
  const today = new Date();
  return termDate < today;
};
