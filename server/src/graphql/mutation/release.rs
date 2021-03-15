use crate::errors;
use crate::model::release::Release;
use crate::model::release::ReleaseType;
use async_graphql::*;
use std::convert::TryInto;

pub struct ReleaseMutation;

#[Object]
impl ReleaseMutation {
    async fn create(
        &self,
        ctx: &Context<'_>,
        title: String,
        release_type: ReleaseType,
        artists: Vec<ArtistInput>,
    ) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;

        // verify artist inputs are valid before adding release
        let artists_internal = artists
            .iter()
            .map(ArtistInputInternal::from)
            .collect::<Result<Vec<_>, _>>()?;

        // only add release once artist inputs are verified
        let release = env.db().release().create(&title, release_type).await?;

        for (i, artist_internal) in artists_internal.iter().enumerate() {
            let artist = match artist_internal {
                ArtistInputInternal::Existing(id) => env.db().artist().get(*id).await?,
                ArtistInputInternal::New(name) => env.db().artist().create(&name).await?,
            };
            env.db()
                .artist()
                .add_to_release(release.release_id, artist.artist_id, i.try_into()?)
                .await?;
        }

        Ok(release)
    }
}

#[derive(InputObject)]
struct ArtistInput {
    id: Option<i32>,
    name: Option<String>,
}

enum ArtistInputInternal {
    Existing(i32),
    New(String),
}

impl ArtistInputInternal {
    fn from(input: &ArtistInput) -> Result<Self, errors::Error> {
        match input.id {
            Some(id) => match &input.name {
                Some(_name) => Err(errors::Error::InvalidInput(
                    "ArtistInput cannot have both `id` and `name`".to_string(),
                )),
                None => Ok(ArtistInputInternal::Existing(id)),
            },
            None => match &input.name {
                Some(name) => Ok(ArtistInputInternal::New(name.to_string())),
                None => Err(errors::Error::InvalidInput(
                    "ArtistInput must specify either `id` or `name`".to_string(),
                )),
            },
        }
    }
}
