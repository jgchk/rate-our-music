use crate::model::release::Release;
use async_graphql::*;

pub struct ReleaseQuery;

#[Object]
impl ReleaseQuery {
    async fn get_one(&self, ctx: &Context<'_>, id: i32) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().release().get(id).await?;
        Ok(release)
    }
}
