use crate::model::track::Track;
use async_graphql::*;
pub struct TrackQuery;

#[Object]
impl TrackQuery {
    async fn get(&self, ctx: &Context<'_>, id: i32) -> Result<Track> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let track = env.db().track().get(id).await?;
        Ok(track)
    }
}
