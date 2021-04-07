use crate::model::{genre::Genre, release_genre::ReleaseGenre, track_genre::TrackGenre};
use async_graphql::*;

pub struct GenreQuery;

#[Object]
impl GenreQuery {
    async fn get(&self, ctx: &Context<'_>, id: i32) -> Result<Genre> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let genre = env.db().genre().get(id).await?;
        Ok(genre)
    }

    async fn get_by_release(
        &self,
        ctx: &Context<'_>,
        genre_id: i32,
        release_id: i32,
    ) -> Result<ReleaseGenre> {
        let genre = self.get(ctx, genre_id).await?;
        Ok(ReleaseGenre::new(release_id, &genre))
    }

    async fn get_by_track(
        &self,
        ctx: &Context<'_>,
        genre_id: i32,
        track_id: i32,
    ) -> Result<TrackGenre> {
        let genre = self.get(ctx, genre_id).await?;
        Ok(TrackGenre::new(track_id, &genre))
    }
}
