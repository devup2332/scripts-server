export const normalizeString = (text: string) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('.', '')
    .trim()
    .toLowerCase();
};
