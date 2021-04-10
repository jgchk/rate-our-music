use crate::model::account::Account;
use crate::model::track::Track;
use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct TrackReview {
    pub id: i32,
    pub track_id: i32,
    pub account_id: i32,
    pub rating: Option<i16>,
    pub text: Option<String>,
}

#[ComplexObject]
impl TrackReview {
    async fn track(&self, ctx: &Context<'_>) -> Result<Track> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let track = env.db().track().get(self.track_id).await?;
        Ok(track)
    }

    async fn account(&self, ctx: &Context<'_>) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(self.account_id).await?;
        Ok(account)
    }
}
