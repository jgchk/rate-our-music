use crate::errors::Error;
use crate::model::artist::Artist;
use crate::model::release_artist::ReleaseArtist;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct ArtistDatabase<'a>(&'a PgPool);

impl<'a> ArtistDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(&self, name: &str) -> Result<Artist, Error> {
        let artist = sqlx::query!(
            "INSERT INTO artist (artist_name) VALUES ($1) RETURNING artist_id",
            name,
        )
        .fetch_one(self.0)
        .await?;
        Ok(Artist {
            artist_id: artist.artist_id,
            artist_name: name.to_string(),
        })
    }

    pub async fn get(&self, id: i32) -> Result<Artist, Error> {
        sqlx::query_as!(Artist, "SELECT * FROM artist WHERE artist_id = $1", id)
            .fetch_one(self.0)
            .await
            .map_err(|e| e.into())
    }

    pub async fn filter_by_name(&self, name: String) -> Result<Vec<Artist>, Error> {
        let filter = format!("{}%", name);
        sqlx::query_as!(
            Artist,
            "SELECT * FROM artist WHERE artist_name LIKE $1",
            filter
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<Artist>, Error> {
        sqlx::query_as!(
            Artist,
            "SELECT a.*
            FROM release_artist ra
            JOIN artist a ON a.artist_id = ra.artist_id
            WHERE ra.release_id = $1
            ORDER BY ra.release_artist_order ASC",
            release_id
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
    }

    pub async fn add_to_release(
        &self,
        release_id: i32,
        artist_id: i32,
        order: i16,
    ) -> Result<ReleaseArtist, Error> {
        sqlx::query!(
            "INSERT INTO release_artist (release_id, artist_id, release_artist_order)
            VALUES ($1, $2, $3)",
            release_id,
            artist_id,
            order
        )
        .execute(self.0)
        .await?;
        Ok(ReleaseArtist {
            release_id,
            artist_id,
            release_artist_order: order,
        })
    }
}
