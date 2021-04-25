import { Artist } from './types'

export const getFromTable = <E extends Element = Element>(
  label: string
): E | undefined => {
  const container = [
    ...document.querySelectorAll('.album_info .info_hdr'),
  ].find((el) => el.textContent?.trim() === label)?.parentElement
  return container?.querySelector<E>('td') ?? undefined
}

export const getMonth = (str: string): number | undefined => {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]
  const index = months.indexOf(str.toLowerCase())
  return index === -1 ? undefined : index + 1
}

export const isNotNull = <T>(t: T | null): t is T => t !== null

export const isDefined = <T>(t: T | undefined): t is T => t !== undefined

export const getNodeText = (el: Element): string | undefined => {
  const node = el.cloneNode(true)
  for (const child of node.childNodes) {
    if (child.nodeType !== Node.TEXT_NODE) {
      child.remove()
    }
  }
  return node?.textContent ?? undefined
}

export const getArtist = (el: HTMLAnchorElement): Artist | undefined => {
  const name = getNodeText(el)?.trim()
  if (!name) return
  const localizedName = el.querySelector('.subtext')?.textContent?.slice(1, -1)
  const id = el.title.slice(1, -1)
  const link = el.href
  return { id, link, name, localizedName }
}
