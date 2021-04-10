use super::{genre::Genre, release::Release};
use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct ReleaseGenre {
    pub release_id: i32,
    pub genre_id: i32,
}

#[ComplexObject]
impl ReleaseGenre {
    async fn release(&self, ctx: &Context<'_>) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().release().get(self.release_id).await?;
        Ok(release)
    }

    async fn genre(&self, ctx: &Context<'_>) -> Result<Genre> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let genre = env.db().genre().get(self.genre_id).await?;
        Ok(genre)
    }

    async fn weight(&self, ctx: &Context<'_>) -> Result<f64> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let votes = env
            .db()
            .release_genre_vote()
            .get_by_release_genre(self.release_id, self.genre_id)
            .await?;
        let sum = votes.iter().map(|vote| vote.value as i32).sum::<i32>();
        let avg = (sum as f64) / (votes.len() as f64);
        Ok(avg)
    }
}
