use crate::model::track_review::TrackReview;
use async_graphql::*;

pub struct TrackReviewQuery;

#[Object]
impl TrackReviewQuery {
    async fn get(&self, ctx: &Context<'_>, id: i32) -> Result<TrackReview> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let review = env.db().track_review().get(id).await?;
        Ok(review)
    }
}
