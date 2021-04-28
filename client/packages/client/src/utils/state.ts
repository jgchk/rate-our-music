type HasId = { id: number }
type IdRecord<T> = { [id: number]: T }

export const ids = <T extends HasId>(arr: T[]): Set<number> =>
  new Set(arr.map((item) => item.id))

export const mergeIds = <T extends HasId>(
  record: IdRecord<T>,
  arr: T[]
): IdRecord<T> =>
  arr.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: { ...record[curr.id], ...curr } }),
    { ...record }
  )
