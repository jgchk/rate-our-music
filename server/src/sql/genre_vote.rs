use crate::errors::Error;
use crate::model::genre_vote::GenreVote;
use crate::model::genre_vote::GenreVoteType;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct GenreVoteDatabase<'a>(&'a PgPool);

impl<'a> GenreVoteDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        account_id: i32,
        release_id: i32,
        genre_id: i32,
        value: i16,
        vote_type: GenreVoteType,
    ) -> Result<GenreVote, Error> {
        sqlx::query!(
            "INSERT INTO release_genre_vote (account_id, release_id, genre_id, release_genre_vote_value, release_genre_vote_type)
            VALUES ($1, $2, $3, $4, $5)",
            account_id, release_id, genre_id, value, vote_type as GenreVoteType,
        )
        .execute(self.0)
        .await?;
        Ok(GenreVote {
            account_id,
            release_id,
            genre_id,
            release_genre_vote_value: value,
            release_genre_vote_type: vote_type,
        })
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<GenreVote>, Error> {
        sqlx::query_as!(
            GenreVote,
            r#"SELECT
                account_id,
                release_id,
                genre_id,
                release_genre_vote_value,
                release_genre_vote_type as "release_genre_vote_type: GenreVoteType"
            FROM release_genre_vote
            WHERE release_id = $1"#,
            release_id
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
    }
}
