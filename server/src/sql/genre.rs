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
        sqlx::query_as!(Genre, "SELECT * FROM genre WHERE id = $1", id)
            .fetch_one(self.0)
            .await
            .map_err(Error::from)
    }

    pub async fn get_all(&self) -> Result<Vec<Genre>, Error> {
        sqlx::query_as!(Genre, "SELECT * FROM genre")
            .fetch_all(self.0)
            .await
            .map_err(Error::from)
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<Genre>, Error> {
        sqlx::query_as!(
            Genre,
            "SELECT *
            FROM genre
            WHERE id IN (
                SELECT genre_id
                FROM release_genre_vote
                WHERE release_id = $1
            )",
            release_id,
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_track(&self, track_id: i32) -> Result<Vec<Genre>, Error> {
        sqlx::query_as!(
            Genre,
            "SELECT *
            FROM genre
            WHERE id IN (
                SELECT genre_id
                FROM track_genre_vote
                WHERE track_id = $1
            )",
            track_id,
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }
}
