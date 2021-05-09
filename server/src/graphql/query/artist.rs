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

    async fn search(&self, ctx: &Context<'_>, query: String) -> Result<Vec<Artist>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artists = env.db().artist().search(query).await?;
        Ok(artists)
    }
}
