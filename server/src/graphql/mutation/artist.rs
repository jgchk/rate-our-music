use crate::model::artist::Artist;
use async_graphql::*;

pub struct ArtistMutation;

#[Object]
impl ArtistMutation {
    async fn create(&self, ctx: &Context<'_>, name: String) -> Result<Artist> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artist = env.db().artist().create(&name).await?;
        Ok(artist)
    }
}
