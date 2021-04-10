use crate::errors::Error;
use crate::model::artist::Artist;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct ArtistDatabase<'a>(&'a PgPool);

impl<'a> ArtistDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(&self, name: &str) -> Result<Artist, Error> {
        sqlx::query_as!(
            Artist,
            "INSERT INTO artist (name) VALUES ($1) RETURNING *",
            name,
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get(&self, id: i32) -> Result<Artist, Error> {
        sqlx::query_as!(Artist, "SELECT * FROM artist WHERE id = $1", id)
            .fetch_one(self.0)
            .await
            .map_err(Error::from)
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<Artist>, Error> {
        sqlx::query_as!(
            Artist,
            "SELECT a.*
            FROM release_artist ra
            JOIN artist a ON a.id = ra.artist_id
            WHERE ra.release_id = $1",
            release_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }
}
