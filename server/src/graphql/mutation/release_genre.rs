use crate::{errors::Error, model::release_genre_vote::ReleaseGenreVote};
use async_graphql::*;

pub struct ReleaseGenreMutation {
    pub release_id: i32,
    pub genre_id: i32,
}

#[Object]
impl ReleaseGenreMutation {
    async fn vote(&self, ctx: &Context<'_>, value: i16) -> Result<ReleaseGenreVote> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account_id = match env.session() {
            Some(session) => session.account_id(),
            None => return Err(Error::InvalidCredentials.into()),
        };
        let vote = env
            .db()
            .release_genre_vote()
            .create(account_id, self.release_id, self.genre_id, value)
            .await?;
        Ok(vote)
    }
}
