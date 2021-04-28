use crate::{errors::Error, model::track_review::TrackReview};
use sqlx::{types::BigDecimal, PgPool};

#[derive(Debug, Clone)]
pub struct TrackReviewDatabase<'a>(&'a PgPool);

impl<'a> TrackReviewDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        track_id: i32,
        account_id: i32,
        rating: Option<i16>,
        text: Option<&str>,
    ) -> Result<TrackReview, Error> {
        sqlx::query_as!(
            TrackReview,
            "INSERT INTO track_review (track_id, account_id, rating, text)
            VALUES ($1, $2, $3, $4)
            RETURNING *",
            track_id,
            account_id,
            rating,
            text
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get(&self, id: i32) -> Result<TrackReview, Error> {
        sqlx::query_as!(
            TrackReview,
            "SELECT *
            FROM track_review
            WHERE id = $1",
            id
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_track(&self, track_id: i32) -> Result<Vec<TrackReview>, Error> {
        sqlx::query_as!(
            TrackReview,
            "SELECT *
            FROM track_review
            WHERE track_id = $1",
            track_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_account(&self, account_id: i32) -> Result<Vec<TrackReview>, Error> {
        sqlx::query_as!(
            TrackReview,
            "SELECT *
            FROM track_review
            WHERE account_id = $1",
            account_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn average_by_track(&self, track_id: i32) -> Result<Option<BigDecimal>, Error> {
        let result = sqlx::query!(
            "SELECT AVG(rating)
            FROM track_review
            WHERE track_id = $1",
            track_id
        )
        .fetch_one(self.0)
        .await?;
        Ok(result.avg)
    }

    pub async fn update_rating(&self, id: i32, rating: Option<i16>) -> Result<TrackReview, Error> {
        sqlx::query_as!(
            TrackReview,
            "UPDATE track_review
            SET rating = $2
            WHERE id = $1
            RETURNING *",
            id,
            rating
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }
}
