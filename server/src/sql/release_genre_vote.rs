use crate::errors::Error;
use crate::model::release_genre_vote::ReleaseGenreVote;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct ReleaseGenreVoteDatabase<'a>(&'a PgPool);

impl<'a> ReleaseGenreVoteDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        account_id: i32,
        release_id: i32,
        genre_id: i32,
        value: i16,
    ) -> Result<ReleaseGenreVote, Error> {
        sqlx::query_as!(
            ReleaseGenreVote,
            "INSERT INTO release_genre_vote (account_id, release_id, genre_id, value)
            VALUES ($1, $2, $3, $4)
            RETURNING *",
            account_id,
            release_id,
            genre_id,
            value
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_release_genre(
        &self,
        release_id: i32,
        genre_id: i32,
    ) -> Result<Vec<ReleaseGenreVote>, Error> {
        sqlx::query_as!(
            ReleaseGenreVote,
            "SELECT *
            FROM release_genre_vote
            WHERE release_id = $1 AND genre_id = $2",
            release_id,
            genre_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }
}
