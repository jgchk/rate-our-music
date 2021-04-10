use super::{account::Account, genre::Genre, track::Track};
use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct TrackGenreVote {
    pub account_id: i32,
    pub track_id: i32,
    pub genre_id: i32,
    pub value: i16,
}

#[ComplexObject]
impl TrackGenreVote {
    async fn account(&self, ctx: &Context<'_>) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(self.account_id).await?;
        Ok(account)
    }

    async fn track(&self, ctx: &Context<'_>) -> Result<Track> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().track().get(self.track_id).await?;
        Ok(release)
    }

    async fn genre(&self, ctx: &Context<'_>) -> Result<Genre> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let genre = env.db().genre().get(self.genre_id).await?;
        Ok(genre)
    }
}
