export type Release = {
  id: string
  link?: string
  title?: string
  artists?: Artist[]
  type?: string
  releaseDate?: ReleaseDate
  rating?: number
  numRatings?: number
  primaryGenres?: string[]
  secondaryGenres?: string[]
  descriptors?: string[]
  mediaLinks?: MediaLinks
  tracks?: Track[]
  credits?: Credit[]
}

export type Artist = {
  id: string
  link: string
  name: string
  localizedName?: string
}

export type ReleaseDate = {
  day?: number
  month?: number
  year: number
}

export type MediaLinks = { [platform: string]: string }

export type Track = {
  num: string
  title: string
  duration?: string
}

export type Credit = {
  artist: string | Artist
  role: string
  tracks?: string[]
}
