use crate::model::release::Release;
use async_graphql::{Context, Object, Result};
use fake::{Dummy, Fake};

#[derive(Dummy)]
pub struct Artist {
    pub artist_id: i32,
    pub artist_name: String,
}

#[Object]
impl Artist {
    async fn id(&self) -> i32 {
        self.artist_id
    }

    async fn name(&self) -> String {
        (&self.artist_name).to_string()
    }

    async fn releases(&self, ctx: &Context<'_>) -> Result<Vec<Release>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artists = env.db().release().get_by_artist(self.artist_id).await?;
        Ok(artists)
    }
}
