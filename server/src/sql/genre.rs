use crate::errors::Error;
use crate::model::genre::Genre;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct GenreDatabase<'a>(&'a PgPool);

impl<'a> GenreDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get(&self, id: i32) -> Result<Genre, Error> {
        sqlx::query_as!(Genre, "SELECT * FROM genre WHERE genre_id = $1", id)
            .fetch_one(self.0)
            .await
            .map_err(|e| e.into())
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<Genre>, Error> {
        sqlx::query_as!(
            Genre,
            r#"SELECT *
            FROM genre
            WHERE genre_id IN (
                SELECT genre_id
                FROM release_genre_vote
                WHERE release_id = $1
            )"#,
            release_id,
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
    }
}
