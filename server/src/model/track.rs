use super::{track_genre::TrackGenre, track_review::TrackReview};
use crate::model::artist::Artist;
use crate::model::release::Release;
use async_graphql::{ComplexObject, Context, Result, SimpleObject};
use num_traits::ToPrimitive;

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct Track {
    pub id: i32,
    pub release_id: i32,
    pub title: String,
    pub track_num: i16,
    pub duration_ms: Option<i32>,
}

#[ComplexObject]
impl Track {
    async fn release(&self, ctx: &Context<'_>) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().release().get_by_track(self.release_id).await?;
        Ok(release)
    }

    async fn artists(&self, ctx: &Context<'_>) -> Result<Vec<Artist>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artists = env.db().artist().get_by_release(self.release_id).await?;
        Ok(artists)
    }

    async fn genres(&self, ctx: &Context<'_>) -> Result<Vec<TrackGenre>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let genres = env.db().genre().get_by_track(self.id).await?;
        let track_genres = genres
            .iter()
            .map(|genre| TrackGenre {
                track_id: self.id,
                genre_id: genre.id,
            })
            .collect();
        Ok(track_genres)
    }

    async fn site_rating(&self, ctx: &Context<'_>) -> Result<Option<f64>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let mean = env
            .db()
            .track_review()
            .average_by_track(self.release_id)
            .await?;
        Ok(mean.and_then(|b| b.to_f64()))
    }

    async fn reviews(&self, ctx: &Context<'_>) -> Result<Vec<TrackReview>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let reviews = env.db().track_review().get_by_track(self.id).await?;
        Ok(reviews)
    }
}
