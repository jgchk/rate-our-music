use crate::model::account::Account;
use crate::model::release::Release;
use async_graphql::{Context, Object, Result};

pub struct ReleaseReview {
    pub release_review_id: i32,
    pub release_id: i32,
    pub account_id: i32,
    pub release_review_rating: Option<i16>,
    pub release_review_text: Option<String>,
}

#[Object]
impl ReleaseReview {
    async fn id(&self) -> i32 {
        self.release_review_id
    }

    async fn release(&self, ctx: &Context<'_>) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().release().get(self.release_id).await?;
        Ok(release)
    }

    async fn account(&self, ctx: &Context<'_>) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(self.account_id).await?;
        Ok(account)
    }

    async fn rating(&self) -> Option<i16> {
        self.release_review_rating
    }

    async fn text(&self) -> Option<String> {
        self.release_review_text.as_ref().map(String::from)
    }
}
