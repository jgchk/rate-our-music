use crate::errors::Error;
use crate::model::release::RawRelease;
use crate::model::release::Release;
use crate::model::release::ReleaseType;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct ReleaseDatabase<'a>(&'a PgPool);

impl<'a> ReleaseDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(&self, title: &str, release_type: ReleaseType) -> Result<Release, Error> {
        let release = sqlx::query!(
            "INSERT INTO release (release_title, release_type)
            VALUES ($1, $2)
            RETURNING release_id",
            title,
            release_type as ReleaseType
        )
        .fetch_one(self.0)
        .await?;
        Ok(Release {
            release_id: release.release_id,
            release_title: title.to_string(),
            release_date: None,
            release_type,
        })
    }

    pub async fn get(&self, id: i32) -> Result<Release, Error> {
        sqlx::query_as!(
            RawRelease,
            r#"SELECT
                release_id,
                release_title,
                release_date_year,
                release_date_month,
                release_date_day,
                release_type as "release_type: ReleaseType"
            FROM release
            WHERE release_id = $1"#,
            id,
        )
        .fetch_one(self.0)
        .await
        .map_err(|e| e.into())
        .and_then(|raw_release| raw_release.into())
    }

    pub async fn get_by_artist(&self, artist_id: i32) -> Result<Vec<Release>, Error> {
        sqlx::query_as!(
            RawRelease,
            r#"SELECT
                r.release_id,
                r.release_title,
                r.release_date_year,
                r.release_date_month,
                r.release_date_day,
                r.release_type as "release_type: _"
            FROM release_artist ra
            JOIN release r ON r.release_id = ra.release_id
            WHERE ra.artist_id = $1"#,
            artist_id
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
        .and_then(|raw_releases| {
            raw_releases
                .iter()
                .map(|raw_release| raw_release.into())
                .collect()
        })
    }

    pub async fn get_by_track(&self, track_id: i32) -> Result<Release, Error> {
        sqlx::query_as!(
            RawRelease,
            r#"SELECT
                r.release_id,
                r.release_title,
                r.release_date_year,
                r.release_date_month,
                r.release_date_day,
                r.release_type as "release_type: _"
            FROM release r
            LEFT JOIN track t ON r.release_id = t.release_id
            WHERE t.track_id = $1"#,
            track_id
        )
        .fetch_one(self.0)
        .await
        .map_err(|e| e.into())
        .and_then(|release| release.into())
    }
}
