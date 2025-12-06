export const chunk = <T>(array: T[], size: number = 10) => {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    const chunked = array.slice(i, i + size);
    chunks.push(chunked);
  }

  return chunks;
};
