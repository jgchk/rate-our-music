use crate::errors::Error;
use crate::model::release::Release;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct ReleaseDatabase<'a>(&'a PgPool);

impl<'a> ReleaseDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get(&self, id: i32) -> Result<Release, Error> {
        sqlx::query_as!(
            Release,
            "SELECT *
            FROM release
            WHERE id = $1",
            id,
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_artist(&self, artist_id: i32) -> Result<Vec<Release>, Error> {
        sqlx::query_as!(
            Release,
            "SELECT *
            FROM release
            WHERE id IN (
                SELECT release_id
                FROM release_artist
                WHERE release_id = $1
            )",
            artist_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_track(&self, track_id: i32) -> Result<Release, Error> {
        sqlx::query_as!(
            Release,
            "SELECT *
            FROM release
            WHERE id IN (
                SELECT release_id
                FROM track
                WHERE id = $1
            )",
            track_id
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }
}
