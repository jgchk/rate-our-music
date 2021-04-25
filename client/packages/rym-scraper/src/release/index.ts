import { setRelease } from '../common/db'
import {
  getArtists,
  getCredits,
  getDescriptors,
  getId,
  getLink,
  getMediaLinks,
  getNumRatings,
  getPrimaryGenres,
  getRating,
  getReleaseDate,
  getSecondaryGenres,
  getTitle,
  getTracks,
  getType,
} from './getters'
import { Release } from './types'

const main = async () => {
  const id = getId()
  if (!id) throw new Error('could not find release id')

  const release: Release = {
    id,
    link: getLink(),
    title: getTitle(),
    artists: getArtists(),
    type: getType(),
    releaseDate: getReleaseDate(),
    rating: getRating(),
    numRatings: getNumRatings(),
    primaryGenres: getPrimaryGenres(),
    secondaryGenres: getSecondaryGenres(),
    descriptors: getDescriptors(),
    mediaLinks: getMediaLinks(),
    tracks: getTracks(),
    credits: getCredits(),
  }

  await setRelease(release)
}

void main()
