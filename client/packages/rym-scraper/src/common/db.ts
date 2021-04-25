import { Release } from '../release/types'

const get = <T>(key: string): Promise<T | undefined> =>
  new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => resolve(result[key]))
  })

const set = <T>(key: string, value: T): Promise<void> =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => resolve())
  })

type Db = { [id: string]: Release }

export const setRelease = async (release: Release): Promise<void> => {
  const db = (await get<Db>('release')) ?? {}
  await set('release', { ...db, [release.id]: release })
}

export const getReleases = async (): Promise<Release[]> => {
  const db = (await get<Db>('release')) ?? {}
  return Object.values(db)
}

export const setReleases = async (releases: Db): Promise<void> => {
  await set('release', releases)
}
