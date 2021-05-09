use crate::model::release_type::ReleaseType;
use async_graphql::*;

pub struct ReleaseTypeQuery;

#[Object]
impl ReleaseTypeQuery {
    async fn get_all(&self, ctx: &Context<'_>) -> Result<Vec<ReleaseType>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release_types = env.db().release_type().get_all().await?;
        Ok(release_types)
    }
}
