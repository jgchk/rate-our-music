use crate::model::account::Account;
use crate::model::descriptor::Descriptor;
use crate::model::release::Release;
use async_graphql::{Context, Object, Result};

pub struct DescriptorVote {
    pub account_id: i32,
    pub release_id: i32,
    pub descriptor_id: i32,
    pub release_descriptor_vote_value: i16,
}

#[Object]
impl DescriptorVote {
    async fn account(&self, ctx: &Context<'_>) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(self.account_id).await?;
        Ok(account)
    }

    async fn release(&self, ctx: &Context<'_>) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().release().get(self.release_id).await?;
        Ok(release)
    }

    async fn descriptor(&self, ctx: &Context<'_>) -> Result<Descriptor> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let descriptor = env.db().descriptor().get(self.descriptor_id).await?;
        Ok(descriptor)
    }

    async fn value(&self) -> i16 {
        self.release_descriptor_vote_value
    }
}
