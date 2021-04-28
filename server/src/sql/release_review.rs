use crate::{errors::Error, model::release_review::ReleaseReview};
use sqlx::{types::BigDecimal, PgPool};

#[derive(Debug, Clone)]
pub struct ReleaseReviewDatabase<'a>(&'a PgPool);

impl<'a> ReleaseReviewDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        release_id: i32,
        account_id: i32,
        rating: Option<i16>,
        text: Option<&str>,
    ) -> Result<ReleaseReview, Error> {
        sqlx::query_as!(
            ReleaseReview,
            "INSERT INTO release_review (release_id, account_id, rating, text)
            VALUES ($1, $2, $3, $4)
            RETURNING *",
            release_id,
            account_id,
            rating,
            text
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get(&self, id: i32) -> Result<ReleaseReview, Error> {
        sqlx::query_as!(
            ReleaseReview,
            "SELECT *
            FROM release_review
            WHERE id = $1",
            id
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<ReleaseReview>, Error> {
        sqlx::query_as!(
            ReleaseReview,
            "SELECT *
            FROM release_review
            WHERE release_id = $1",
            release_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_account(&self, account_id: i32) -> Result<Vec<ReleaseReview>, Error> {
        sqlx::query_as!(
            ReleaseReview,
            "SELECT *
            FROM release_review
            WHERE account_id = $1",
            account_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn average_by_release(&self, release_id: i32) -> Result<Option<BigDecimal>, Error> {
        let result = sqlx::query!(
            "SELECT AVG(rating)
            FROM release_review
            WHERE release_id = $1",
            release_id
        )
        .fetch_one(self.0)
        .await?;
        Ok(result.avg)
    }

    pub async fn update_rating(
        &self,
        id: i32,
        rating: Option<i16>,
    ) -> Result<ReleaseReview, Error> {
        sqlx::query_as!(
            ReleaseReview,
            "UPDATE release_review
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
