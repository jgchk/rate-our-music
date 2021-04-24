use crate::{errors, model::release_review::ReleaseReview};
use async_graphql::*;
use errors::Error::InvalidReview;

pub struct ReleaseReviewMutation;

#[Object]
impl ReleaseReviewMutation {
    async fn create(
        &self,
        ctx: &Context<'_>,
        release_id: i32,
        account_id: i32,
        rating: Option<i16>,
        text: Option<String>,
    ) -> Result<ReleaseReview> {
        if rating.is_none() && text.is_none() {
            return Err(InvalidReview.into());
        }

        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env
            .db()
            .release_review()
            .create(release_id, account_id, rating, text.as_deref())
            .await?;
        Ok(release)
    }

    async fn update_rating(
        &self,
        ctx: &Context<'_>,
        review_id: i32,
        rating: Option<i16>,
    ) -> Result<ReleaseReview> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env
            .db()
            .release_review()
            .update_rating(review_id, rating)
            .await?;
        Ok(release)
    }
}
