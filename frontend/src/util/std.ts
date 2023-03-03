export function range(limit: number, start: number = 0): number[] {
  return Array(limit)
    .fill(0)
    .map((_, i) => i + start)
}

export function sum(values: number[]): number {
  return values.reduce((sum, curr) => sum + curr, 0)
}
