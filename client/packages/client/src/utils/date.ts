export type Duration = {
  years?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
}

export const milliseconds = ({
  years,
  months,
  weeks,
  days,
  hours,
  minutes,
  seconds,
}: Duration): number => {
  let totalDays = 0

  const yearInDays = 365.2425
  if (years) totalDays += years * yearInDays
  if (months) totalDays += months * (yearInDays / 12)
  if (weeks) totalDays += weeks * 7
  if (days) totalDays += days

  let totalSeconds = totalDays * 24 * 60 * 60

  if (hours) totalSeconds += hours * 60 * 60
  if (minutes) totalSeconds += minutes * 60
  if (seconds) totalSeconds += seconds

  return Math.round(totalSeconds * 1000)
}

export const addMilliseconds = (ms: number) => (date: Date): Date =>
  new Date(date.getTime() + ms)

export const addSeconds = (s: number): ((date: Date) => Date) =>
  addMilliseconds(s * 1000)

export const addMinutes = (m: number): ((date: Date) => Date) =>
  addSeconds(m * 60)

export const addHours = (h: number): ((date: Date) => Date) =>
  addMinutes(h * 60)

export const addDays = (d: number) => (date: Date): Date => {
  const newDate = new Date(date)
  newDate.setDate(date.getDate() + d)
  return newDate
}

export const differenceInMilliseconds = (a: Date, b: Date): number =>
  a.getTime() - b.getTime()
