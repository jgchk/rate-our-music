export const range = (n: number): number[] => [
  ...Array.from({ length: n }).keys(),
]

export const findMap = <A, B>(
  arr: A[] | readonly A[],
  fn: (a: A) => B
): B | undefined => {
  for (const item of arr) {
    const val = fn(item)
    if (val) return val
  }
}
