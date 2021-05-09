use crate::model::release::Release;
use crate::{errors::Error, model::release::ReleaseDate};
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct ReleaseDatabase<'a>(&'a PgPool);

impl<'a> ReleaseDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        title: String,
        release_type_id: i32,
        release_date: Option<ReleaseDate>,
        cover_art: Option<String>,
    ) -> Result<Release, Error> {
        sqlx::query_as!(
            Release,
            "INSERT INTO release
                ( title
                , release_type_id
                , release_date_year
                , release_date_month
                , release_date_day
                , cover_art
                )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *",
            title,
            release_type_id,
            release_date.map(|rd| rd.year),
            release_date.and_then(|rd| rd.month),
            release_date.and_then(|rd| rd.day),
            cover_art
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
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
