use crate::model::release::Release;
use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct Artist {
    pub id: i32,
    pub name: String,
}

#[ComplexObject]
impl Artist {
    async fn releases(&self, ctx: &Context<'_>) -> Result<Vec<Release>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artists = env.db().release().get_by_artist(self.id).await?;
        Ok(artists)
    }
}
