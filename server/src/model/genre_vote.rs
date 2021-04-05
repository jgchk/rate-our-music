use crate::model::account::Account;
use crate::model::genre::Genre;
use crate::model::release::Release;
use async_graphql::{Context, Object, Result};

pub struct GenreVote {
    pub account_id: i32,
    pub release_id: i32,
    pub genre_id: i32,
    pub release_genre_vote_value: i16,
}

#[Object]
impl GenreVote {
    async fn account(&self, ctx: &Context<'_>) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(self.account_id).await?;
        Ok(account)
    }

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

    async fn value(&self) -> i16 {
        self.release_genre_vote_value
    }
}
