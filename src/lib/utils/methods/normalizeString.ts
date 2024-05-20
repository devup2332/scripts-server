export const normalizeString = (text: any) => {
  const str = String(text);
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('.', '')
    .trim()
    .toLowerCase();
};
