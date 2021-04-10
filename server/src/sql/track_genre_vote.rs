use crate::{errors::Error, model::track_genre_vote::TrackGenreVote};
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct TrackGenreVoteDatabase<'a>(&'a PgPool);

impl<'a> TrackGenreVoteDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get_by_track_genre(
        &self,
        track_id: i32,
        genre_id: i32,
    ) -> Result<Vec<TrackGenreVote>, Error> {
        sqlx::query_as!(
            TrackGenreVote,
            "SELECT *
            FROM track_genre_vote
            WHERE track_id = $1 AND genre_id = $2",
            track_id,
            genre_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }
}
