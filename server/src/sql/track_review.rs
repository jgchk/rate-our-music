use crate::{errors::Error, model::track_review::TrackReview};
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct TrackReviewDatabase<'a>(&'a PgPool);

impl<'a> TrackReviewDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get_by_track(&self, track_id: i32) -> Result<Vec<TrackReview>, Error> {
        sqlx::query_as!(
            TrackReview,
            r#"SELECT *
            FROM track_review
            WHERE track_id = $1"#,
            track_id
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
    }
}
