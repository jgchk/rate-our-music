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

    async fn get_all(&self, ctx: &Context<'_>) -> Result<Vec<Genre>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let genres = env.db().genre().get_all().await?;
        Ok(genres)
    }

    async fn get_by_release(&self, genre_id: i32, release_id: i32) -> Result<ReleaseGenre> {
        Ok(ReleaseGenre {
            release_id,
            genre_id,
        })
    }

    async fn get_by_track(&self, genre_id: i32, track_id: i32) -> Result<TrackGenre> {
        Ok(TrackGenre { track_id, genre_id })
    }
}
