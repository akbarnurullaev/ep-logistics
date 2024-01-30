export const truncate = (text: string, length?: number) => {
  if (!text) return ''
  return text.substr(0, length || 100) + "...";
};
