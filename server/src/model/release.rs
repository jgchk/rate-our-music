use super::{release_genre::ReleaseGenre, release_review::ReleaseReview};
use crate::model::artist::Artist;
use crate::model::track::Track;
use async_graphql::{ComplexObject, Context, Enum, InputObject, Result, SimpleObject};
use num_traits::cast::ToPrimitive;

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct Release {
    pub id: i32,
    pub title: String,
    pub release_date_year: Option<i16>,
    pub release_date_month: Option<i16>,
    pub release_date_day: Option<i16>,
    pub release_type_id: i32,
    pub cover_art: Option<String>,
}

#[derive(SimpleObject)]
pub struct ReleaseDate {
    pub year: i16,
    pub month: Option<i16>,
    pub day: Option<i16>,
}

#[derive(InputObject)]
pub struct ReleaseDateInput {
    pub year: i16,
    pub month: Option<i16>,
    pub day: Option<i16>,
}

#[derive(sqlx::Type, Debug, Clone, Copy, Enum, Eq, PartialEq)]
#[sqlx(type_name = "release_type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ReleaseType {
    Album,
    Compilation,
    Ep,
    Single,
    Mixtape,
    DjMix,
    Bootleg,
    Video,
}

#[ComplexObject]
impl Release {
    async fn release_date(&self) -> Option<ReleaseDate> {
        self.release_date_year.map(|year| ReleaseDate {
            year,
            month: self.release_date_month,
            day: self.release_date_day,
        })
    }

    async fn artists(&self, ctx: &Context<'_>) -> Result<Vec<Artist>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artists = env.db().artist().get_by_release(self.id).await?;
        Ok(artists)
    }

    async fn tracks(&self, ctx: &Context<'_>) -> Result<Vec<Track>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let tracks = env.db().track().get_by_release(self.id).await?;
        Ok(tracks)
    }

    async fn genres(&self, ctx: &Context<'_>) -> Result<Vec<ReleaseGenre>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let genres = env.db().genre().get_by_release(self.id).await?;
        let release_genres = genres
            .iter()
            .map(|genre| ReleaseGenre {
                release_id: self.id,
                genre_id: genre.id,
            })
            .collect();
        Ok(release_genres)
    }

    async fn site_rating(&self, ctx: &Context<'_>) -> Result<Option<f64>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let mean = env
            .db()
            .release_review()
            .average_by_release(self.id)
            .await?;
        Ok(mean.and_then(|b| b.to_f64()))
    }

    async fn reviews(&self, ctx: &Context<'_>) -> Result<Vec<ReleaseReview>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let reviews = env.db().release_review().get_by_release(self.id).await?;
        Ok(reviews)
    }
}
