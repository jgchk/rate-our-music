use crate::model::account::Account;
use crate::model::track::Track;
use async_graphql::{Context, Object, Result};

pub struct TrackReview {
    pub track_review_id: i32,
    pub track_id: i32,
    pub account_id: i32,
    pub track_review_rating: Option<i16>,
    pub track_review_text: Option<String>,
}

#[Object]
impl TrackReview {
    async fn id(&self) -> i32 {
        self.track_review_id
    }

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

    async fn rating(&self) -> Option<i16> {
        self.track_review_rating
    }

    async fn text(&self) -> Option<String> {
        self.track_review_text.as_ref().map(String::from)
    }
}
