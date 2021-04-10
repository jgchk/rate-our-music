use crate::errors::Error;
use crate::model::track::Track;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct TrackDatabase<'a>(&'a PgPool);

impl<'a> TrackDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get(&self, id: i32) -> Result<Track, Error> {
        sqlx::query_as!(
            Track,
            "SELECT *
            FROM track
            WHERE id = $1",
            id
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<Track>, Error> {
        sqlx::query_as!(
            Track,
            "SELECT *
            FROM track
            WHERE release_id = $1",
            release_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }
}
