import { Artist, Credit, MediaLinks, ReleaseDate, Track } from './types'
import {
  getArtist,
  getFromTable,
  getMonth,
  getNodeText,
  isDefined,
  isNotNull,
} from './utils'

export const getId = (): string | undefined =>
  document
    .querySelector<HTMLInputElement>('input.album_shortcut')
    ?.value.slice(1, -1)

export const getLink = (): string | undefined =>
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content

export const getTitle = (): string | undefined =>
  document.querySelector<HTMLMetaElement>('meta[itemprop=name]')?.content

export const getArtists = (): Artist[] | undefined => {
  const els = getFromTable('Artist')?.querySelectorAll<HTMLAnchorElement>(
    'a.artist'
  )
  if (!els) return
  return [...els].map((el) => getArtist(el)).filter(isDefined)
}

export const getLocalizedArtist = (): string | undefined =>
  getFromTable('Artist')
    ?.querySelector('a.artist .subtext')
    ?.textContent?.slice(1, -1) ?? undefined

export const getType = (): string | undefined =>
  getFromTable('Type')?.textContent ?? undefined

export const getReleaseDate = (): ReleaseDate | undefined => {
  const str = getFromTable('Released')?.textContent
  if (!str) return
  const match = /(\d{1,2})? ([A-Za-z]+)? (\d{4})/.exec(str)
  if (!match) return
  const yearStr = match[3]
  if (yearStr === undefined) return
  const year = Number.parseInt(yearStr)
  const monthStr = match[2]
  const month = monthStr ? getMonth(monthStr) : undefined
  const dayStr = match[1]
  const day = dayStr ? Number.parseInt(dayStr) : undefined
  return { day, month, year }
}

export const getRating = (): number | undefined => {
  const el = getFromTable('RYM Rating')
  const str = el?.querySelector('.avg_rating')?.textContent
  return str ? Number.parseFloat(str) : undefined
}

export const getNumRatings = (): number | undefined => {
  const el = getFromTable('RYM Rating')
  const str = el
    ?.querySelector('.num_ratings span')
    ?.textContent?.replace(',', '')
  return str ? Number.parseInt(str) : undefined
}

export const getPrimaryGenres = (): string[] | undefined => {
  const els = getFromTable('Genres')?.querySelectorAll(
    '.release_pri_genres a.genre'
  )
  if (!els) return
  return [...els].map((el) => el.textContent).filter(isNotNull)
}

export const getSecondaryGenres = (): string[] | undefined => {
  const els = getFromTable('Genres')?.querySelectorAll(
    '.release_sec_genres a.genre'
  )
  if (!els) return
  return [...els].map((el) => el.textContent).filter(isNotNull)
}

export const getDescriptors = (): string[] | undefined => {
  const els = getFromTable('Descriptors')?.querySelectorAll<HTMLMetaElement>(
    'meta'
  )
  if (!els) return
  return [...els].map((el) => el.content?.trim()).filter(isDefined)
}

export const getMediaLinks = (): MediaLinks => {
  const mediaLinks: MediaLinks = {}
  const els = document.querySelectorAll<HTMLAnchorElement>(
    'a.ui_media_link_btn'
  )
  for (const el of els) {
    const match = /ui_media_link_btn_([A-Za-z]+)/.exec(el.className)
    const platform = match?.[1]
    if (platform) {
      mediaLinks[platform] = el.href
    }
  }
  return mediaLinks
}

export const getTracks = (): Track[] =>
  [...document.querySelectorAll('#tracks .track')]
    .map((el) => {
      const num = el.querySelector('.tracklist_num')?.textContent?.trim()
      if (!num) return
      const title = el
        .querySelector('.tracklist_title .rendered_text')
        ?.textContent?.trim()
      if (!title) return
      const duration =
        el.querySelector('.tracklist_duration')?.textContent?.trim() ||
        undefined
      return {
        num,
        title,
        duration,
      }
    })
    .filter(isDefined)

export const getCredits = (): Credit[] =>
  [...document.querySelectorAll('#credits_ li')].flatMap((el) => {
    const artistEl = el.querySelector<HTMLAnchorElement>('a.artist')
    const artist = artistEl
      ? getArtist(artistEl)
      : el.querySelector(':first-child')?.textContent
    if (!artist) return []
    return [...el.querySelectorAll('.role_name')]
      .map((roleNameEl) => {
        const roleName =
          roleNameEl.querySelector('.rendered_text')?.textContent ||
          getNodeText(roleNameEl)
        if (!roleName) return
        const tracks = roleNameEl
          .querySelector('.role_tracks')
          ?.textContent?.split(', ')
        return { artist, role: roleName, tracks }
      })
      .filter(isDefined)
  })
