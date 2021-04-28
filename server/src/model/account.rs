use super::{release_review::ReleaseReview, track_review::TrackReview};
use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct Account {
    pub id: i32,
    pub username: String,
    #[graphql(skip)]
    pub password: String,
}

#[ComplexObject]
impl Account {
    async fn release_reviews(&self, ctx: &Context<'_>) -> Result<Vec<ReleaseReview>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release_reviews = env.db().release_review().get_by_account(self.id).await?;
        Ok(release_reviews)
    }

    async fn track_reviews(&self, ctx: &Context<'_>) -> Result<Vec<TrackReview>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let track_reviews = env.db().track_review().get_by_account(self.id).await?;
        Ok(track_reviews)
    }
}

#[derive(SimpleObject)]
pub struct Auth {
    pub token: String,
    pub exp: i64,
    pub account: Account,
}
