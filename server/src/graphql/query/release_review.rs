use crate::model::release_review::ReleaseReview;
use async_graphql::*;

pub struct ReleaseReviewQuery;

#[Object]
impl ReleaseReviewQuery {
    async fn get(&self, ctx: &Context<'_>, id: i32) -> Result<ReleaseReview> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let review = env.db().release_review().get(id).await?;
        Ok(review)
    }
}
