use super::{genre::Genre, track::Track};
use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct TrackGenre {
    pub track_id: i32,
    pub genre_id: i32,
}

#[ComplexObject]
impl TrackGenre {
    async fn track(&self, ctx: &Context<'_>) -> Result<Track> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let track = env.db().track().get(self.track_id).await?;
        Ok(track)
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
            .track_genre_vote()
            .get_by_track_genre(self.track_id, self.genre_id)
            .await?;
        let sum = votes.iter().map(|vote| vote.value as i32).sum::<i32>();
        let avg = (sum as f64) / (votes.len() as f64);
        Ok(avg)
    }
}
