export const ids = (arr: { id: number }[]): Set<number> =>
  new Set(arr.map((item) => item.id))
