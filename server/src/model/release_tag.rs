use crate::model::release::Release;
use crate::model::tag::Tag;
use async_graphql::{Context, Object, Result};

pub struct ReleaseTag {
    pub release_id: i32,
    pub tag_id: i32,
}

#[Object]
impl ReleaseTag {
    async fn release(&self, ctx: &Context<'_>) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().release().get(self.release_id).await?;
        Ok(release)
    }

    async fn tag(&self, ctx: &Context<'_>) -> Result<Tag> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().tag().get(self.tag_id).await?;
        Ok(release)
    }
}
