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
