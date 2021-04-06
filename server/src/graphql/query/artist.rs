use crate::model::artist::Artist;
use async_graphql::*;

pub struct ArtistQuery;

#[Object]
impl ArtistQuery {
    async fn get(&self, ctx: &Context<'_>, id: i32) -> Result<Artist> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artist = env.db().artist().get(id).await?;
        Ok(artist)
    }

    async fn filter_by_name(&self, ctx: &Context<'_>, name: String) -> Result<Vec<Artist>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artists = env.db().artist().filter_by_name(name).await?;
        Ok(artists)
    }
}
