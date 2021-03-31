export type Release = {
  id: number
  title: string
  artists: Artist[]
  releaseDate: PartialDate
  coverArt: string
  tracks: Track[]
  genres: Genre[]
  siteRating: number
  friendRating: number
  similarUserRating: number
  userReview: Review
  reviews: Review[]
}

export type Artist = {
  id: number
  name: string
}

export type PartialDate = {
  day?: number
  month?: MonthIndex
  year: number
}

export type MonthIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type Track = {
  id: number
  title: string
  duration: number
}

export type Review = {
  id: number
  user: {
    id: number
    username: string
  }
  rating: number | undefined
  text: string | undefined
}

export type Genre = {
  id: number
  name: string
  weight: number
}

// const initialState: RemoteData<Error, Release> = initial

// const slice = createSlice({
//   name: 'release',
//   initialState,
//   reducers: {
//     loading: () => {
//       // TODO
//     },
//     failure: () => {
//       // TODO
//     },
//     success: () => {
//       // TODO
//     },
//   },
// })

// const getRelease = createAsyncThunk('release/get', async (id, { getState }) => {
//   // const state = getState().release
//   // if (!isLoading(state)) return
//   // const response = await post('/graphql', {
//   //   json: GetReleaseDocument<GetReleaseQueryVariables>(),
//   // })
// })
