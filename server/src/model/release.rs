use crate::errors::Error;
use crate::model::artist::Artist;
use crate::model::descriptor_vote::DescriptorVote;
use crate::model::genre::Genre;
use crate::model::genre::ReleaseGenre;
use crate::model::genre_vote::GenreVote;
use crate::model::tag::Tag;
use crate::model::track::Track;
use async_graphql::{Context, Enum, InputObject, Object, Result, SimpleObject};

use super::release_review::ReleaseReview;

pub struct RawRelease {
    pub release_id: i32,
    pub release_title: String,
    pub release_date_year: Option<i16>,
    pub release_date_month: Option<i16>,
    pub release_date_day: Option<i16>,
    pub release_type: ReleaseType,
    pub release_cover_art: Option<String>,
}

impl Into<std::result::Result<Release, Error>> for &RawRelease {
    fn into(self) -> std::result::Result<Release, Error> {
        Ok(Release {
            release_id: self.release_id,
            release_title: (&self.release_title).to_string(),
            release_date: InternalReleaseDate::from_db(
                self.release_date_year,
                self.release_date_month,
                self.release_date_day,
            )?,
            release_type: self.release_type,
            release_cover_art: self.release_cover_art.as_ref().map(String::from),
        })
    }
}

impl Into<std::result::Result<Release, Error>> for RawRelease {
    fn into(self) -> std::result::Result<Release, Error> {
        (&self).into()
    }
}

pub struct Release {
    pub release_id: i32,
    pub release_title: String,
    pub release_date: Option<InternalReleaseDate>,
    pub release_type: ReleaseType,
    pub release_cover_art: Option<String>,
}

#[derive(Debug, Clone, Copy)]
pub enum InternalReleaseDate {
    Year(i16),
    YearMonth(i16, i16),
    YearMonthDay(i16, i16, i16),
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

impl Into<std::result::Result<InternalReleaseDate, Error>> for ReleaseDateInput {
    fn into(self) -> std::result::Result<InternalReleaseDate, Error> {
        InternalReleaseDate::from_input(self.year, self.month, self.day)
    }
}

impl InternalReleaseDate {
    pub fn from_input(
        year: i16,
        maybe_month: Option<i16>,
        maybe_day: Option<i16>,
    ) -> std::result::Result<InternalReleaseDate, Error> {
        match maybe_month {
            Some(month) => match maybe_day {
                Some(day) => Ok(InternalReleaseDate::YearMonthDay(year, month, day)),
                None => Ok(InternalReleaseDate::YearMonth(year, month)),
            },
            None => match maybe_day {
                Some(_day) => Err(Error::InvalidDate(Some(year), maybe_month, maybe_day)),
                None => Ok(InternalReleaseDate::Year(year)),
            },
        }
    }

    pub fn from_db(
        maybe_year: Option<i16>,
        maybe_month: Option<i16>,
        maybe_day: Option<i16>,
    ) -> std::result::Result<Option<InternalReleaseDate>, Error> {
        match maybe_year {
            Some(year) => Ok(Some(Self::from_input(year, maybe_month, maybe_day)?)),
            None => match maybe_month {
                Some(_month) => Err(Error::InvalidDate(maybe_year, maybe_month, maybe_day)),
                None => match maybe_day {
                    Some(_day) => Err(Error::InvalidDate(maybe_year, maybe_month, maybe_day)),
                    None => Ok(None),
                },
            },
        }
    }
}

impl Into<ReleaseDate> for InternalReleaseDate {
    fn into(self) -> ReleaseDate {
        match self {
            InternalReleaseDate::Year(year) => ReleaseDate {
                year,
                month: None,
                day: None,
            },
            InternalReleaseDate::YearMonth(year, month) => ReleaseDate {
                year,
                month: Some(month),
                day: None,
            },
            InternalReleaseDate::YearMonthDay(year, month, day) => ReleaseDate {
                year,
                month: Some(month),
                day: Some(day),
            },
        }
    }
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

#[Object]
impl Release {
    async fn id(&self) -> i32 {
        self.release_id
    }

    async fn title(&self) -> String {
        (&self.release_title).to_string()
    }

    async fn release_date(&self) -> Option<ReleaseDate> {
        self.release_date.map(|release_date| release_date.into())
    }

    async fn release_type(&self) -> ReleaseType {
        self.release_type
    }

    async fn cover_art(&self) -> Option<String> {
        self.release_cover_art.as_ref().map(String::from)
    }

    async fn artists(&self, ctx: &Context<'_>) -> Result<Vec<Artist>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artists = env.db().artist().get_by_release(self.release_id).await?;
        Ok(artists)
    }

    async fn tracks(&self, ctx: &Context<'_>) -> Result<Vec<Track>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let tracks = env.db().track().get_by_release(self.release_id).await?;
        Ok(tracks)
    }

    async fn genres(&self, ctx: &Context<'_>) -> Result<Vec<ReleaseGenre>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let genres = env.db().genre().get_by_release(self.release_id).await?;
        let release_genres = genres
            .iter()
            .map(|genre| ReleaseGenre::new(self.release_id, genre))
            .collect();
        Ok(release_genres)
    }

    async fn site_rating(&self) -> i16 {
        // TODO
        7
    }

    async fn friend_rating(&self) -> i16 {
        // TODO
        7
    }

    async fn similar_user_rating(&self) -> i16 {
        // TODO
        7
    }

    async fn reviews(&self, ctx: &Context<'_>) -> Result<Vec<ReleaseReview>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let reviews = env
            .db()
            .release_review()
            .get_by_release(self.release_id)
            .await?;
        Ok(reviews)
    }

    async fn descriptor_votes(&self, ctx: &Context<'_>) -> Result<Vec<DescriptorVote>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let descriptor_votes = env
            .db()
            .descriptor_vote()
            .get_by_release(self.release_id)
            .await?;
        Ok(descriptor_votes)
    }

    async fn tags(&self, ctx: &Context<'_>) -> Result<Vec<Tag>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        match env.account_id() {
            Some(account_id) => {
                let tags = env
                    .db()
                    .tag()
                    .get_by_release_and_account(self.release_id, account_id)
                    .await?;
                Ok(tags)
            }
            None => Err(Error::InvalidCredentials.into()),
        }
    }
}
