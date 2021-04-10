use crate::model::artist::Artist;
use crate::model::release::Release;
use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct ReleaseArtist {
    pub release_id: i32,
    pub artist_id: i32,
    pub display_order: i16,
}

#[ComplexObject]
impl ReleaseArtist {
    async fn release(&self, ctx: &Context<'_>) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().release().get(self.release_id).await?;
        Ok(release)
    }

    async fn artist(&self, ctx: &Context<'_>) -> Result<Artist> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().artist().get(self.artist_id).await?;
        Ok(account)
    }
}
