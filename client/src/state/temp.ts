import { Release } from './release'

const getDuration = (minutes: number, seconds: number) =>
  (minutes * 60 + seconds) * 1000

export const tempRelease: Release = {
  id: 0,
  title: 'Complex Playground',
  artists: [{ id: 0, name: 'Euglossine' }],
  releaseDate: { day: 24, month: 2, year: 2015 },
  coverArt:
    'https://e.snmc.io/i/fullres/w/07868f8cceae0b3a6cbb5cc006e9823b/5602710',
  tracks: [
    { id: 0, title: 'Welcome!', durationMs: getDuration(3, 26) },
    { id: 1, title: 'Complex Playground', durationMs: getDuration(4, 33) },
    { id: 2, title: 'Nucleus Pilot', durationMs: getDuration(4, 42) },
    { id: 3, title: 'Bright Bound Foray', durationMs: getDuration(2, 8) },
    { id: 4, title: 'Prairie', durationMs: getDuration(3, 53) },
    { id: 5, title: 'Miraculous Ornament', durationMs: getDuration(3, 54) },
    { id: 6, title: 'Tilted and Twist', durationMs: getDuration(2, 28) },
    { id: 7, title: 'Silver Knot', durationMs: getDuration(4, 12) },
    { id: 8, title: 'The Last Roulette', durationMs: getDuration(4, 15) },
    { id: 9, title: 'Jetski Diva [digi-bonus]', durationMs: getDuration(4, 3) },
  ],
  genres: [
    { id: 0, name: 'Utopian Virtual', weight: 1 },
    { id: 1, name: 'Easy Listening', weight: 0.5 },
    { id: 2, name: 'Jazz Fusion', weight: 0.5 },
    { id: 3, name: 'Sequencer & Tracker', weight: 0.5 },
    { id: 4, name: 'Ambient House', weight: 0.5 },
  ],
  siteRating: 3.25,
  friendRating: 3.5,
  similarUserRating: 3.35,
  userReview: {
    id: 0,
    user: { id: 0, username: 'CaptainMocha' },
    rating: 3,
    text: undefined,
  },
  reviews: [
    {
      id: 1,
      user: { id: 1, username: 'Vito_James' },
      rating: 3.5,
      text:
        'Euglossine, based on this recording alone, is the Venetian Snares of vaporwave. I would make a couple apter comparisons if this was a throwback re-review of much loved Canopy Stories, but despite how much I’m into that one, I’ve known this one that little bit longer. This is the sort of release that I have no problem paying $$ for, there is so much by-hand composition that goes into a record like this one that I wouldn’t be able to reproduce it any faster than the ‘monkeys with Macbeth’ hypothetical, and it makes complete sense that days-of-yore vaporgurus in Beer on the Rug were able to acquire this for their historic roster. This piques my imagination so hard, like the backgrounds in artsy SNES games that you wish your character could go check out with the right amount of pressure on the up D-pad. But you never get there. This album is like an unprogrammed explorational glitch in your favorite childhood one-player game, wonderment + 2 AA batteries included.\nSome of these songs want me to go live the emulator life again, and play something like Harvest Moon 64 that can justify the immense whimsy that’s going on while the album is playing. The most serene-sensational is “Miraculous Ornament” in its attempts to get me stoked in that ‘my expansion pack comes in the mail today’ way; though “Welcome” is a hard one to topple in how just and wonkily it sets up Complex Playground, there are few sways in a hammock as relaxing and meant-to-be as “Bound Bright Foray”. It probably looks like I’m just mad-libbing sentences of prose w/ song titles and I resent that fact. There is serious mystique behind these songs that I don’t want to risk insulting, so, I’ll leave it at this: vaporwave one-hundred percent in sound and where it’s going, even though the traditional way of making it and stretching samples into something new is not what happened here to forge this masterwork. I love this album and Euglossine shows us that no wrong can be produced under that name.',
    },
    { id: 2, user: { id: 2, username: 'fourths' }, rating: 3, text: undefined },
    { id: 3, user: { id: 3, username: 'Jofua' }, rating: 3.5, text: undefined },
    {
      id: 4,
      user: { id: 4, username: 'tinymixtapes' },
      rating: 4,
      text: undefined,
    },
  ],
}
