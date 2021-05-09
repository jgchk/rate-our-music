use crate::{errors::Error, model::release_artist::ReleaseArtist};
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct ReleaseArtistDatabase<'a>(&'a PgPool);

impl<'a> ReleaseArtistDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        release_id: i32,
        artist_id: i32,
        display_order: i16,
    ) -> Result<ReleaseArtist, Error> {
        sqlx::query_as!(
            ReleaseArtist,
            "INSERT INTO release_artist 
                (release_id, artist_id, display_order)
            VALUES ($1, $2, $3)
            RETURNING *",
            release_id,
            artist_id,
            display_order
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }
}
