use crate::model::track_review::TrackReview;
use async_graphql::*;

pub struct TrackReviewMutation;

#[Object]
impl TrackReviewMutation {
    async fn create(
        &self,
        ctx: &Context<'_>,
        track_id: i32,
        account_id: i32,
        rating: Option<i16>,
        text: Option<String>,
    ) -> Result<TrackReview> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env
            .db()
            .track_review()
            .create(track_id, account_id, rating, text.as_deref())
            .await?;
        Ok(release)
    }

    async fn update_rating(
        &self,
        ctx: &Context<'_>,
        review_id: i32,
        rating: Option<i16>,
    ) -> Result<TrackReview> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env
            .db()
            .track_review()
            .update_rating(review_id, rating)
            .await?;
        Ok(release)
    }
}
