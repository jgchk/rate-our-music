use crate::errors::Error;
use crate::model::track::Track;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct TrackDatabase<'a>(&'a PgPool);

impl<'a> TrackDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        release_id: i32,
        title: &str,
        num: i16,
        duration_ms: Option<i32>,
    ) -> Result<Track, Error> {
        let track = sqlx::query!(
            "INSERT INTO track (release_id, track_title, track_num, track_duration_ms)
            VALUES ($1, $2, $3, $4)
            RETURNING track_id",
            release_id,
            title,
            num,
            duration_ms
        )
        .fetch_one(self.0)
        .await?;
        Ok(Track {
            track_id: track.track_id,
            release_id,
            track_title: title.to_string(),
            track_num: num,
            track_duration_ms: duration_ms,
        })
    }

    pub async fn get(&self, id: i32) -> Result<Track, Error> {
        sqlx::query_as!(
            Track,
            "SELECT *
            FROM track
            WHERE track_id = $1",
            id
        )
        .fetch_one(self.0)
        .await
        .map_err(|e| e.into())
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<Track>, Error> {
        sqlx::query_as!(
            Track,
            "SELECT t.*
            FROM track t
            LEFT JOIN release r ON t.release_id = r.release_id
            WHERE r.release_id = $1",
            release_id
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
    }
}
