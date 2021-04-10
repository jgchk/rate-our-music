use crate::model::account::Account;
use crate::model::release::Release;
use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct ReleaseReview {
    pub id: i32,
    pub release_id: i32,
    pub account_id: i32,
    pub rating: Option<i16>,
    pub text: Option<String>,
}

#[ComplexObject]
impl ReleaseReview {
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
}
