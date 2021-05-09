use crate::{
    errors::Error,
    model::release::{Release, ReleaseDate},
};
use async_graphql::{validators::InputValueValidator, Context, InputObject, Object, Result, Value};
use std::convert::TryInto;

pub struct ReleasesMutation;

#[Object]
impl ReleasesMutation {
    async fn add(&self, ctx: &Context<'_>, release: ReleaseInput) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let output = env
            .db()
            .release()
            .create(
                release.title,
                release.release_type_id,
                release.release_date.map(|rd| rd.into()),
                None,
            )
            .await?;
        for (i, artist_id) in release.artist_ids.iter().enumerate() {
            env.db()
                .release_artist()
                .create(output.id, artist_id.to_owned(), i.try_into().unwrap())
                .await?;
        }
        Ok(output)
    }
}

#[derive(InputObject)]
struct ReleaseInput {
    title: String,
    #[graphql(validator(ReleaseDateValidator))]
    release_date: Option<ReleaseDateInput>,
    release_type_id: i32,
    artist_ids: Vec<i32>,
}

#[derive(InputObject)]
struct ReleaseDateInput {
    year: i16,
    month: Option<i16>,
    day: Option<i16>,
}

impl Into<ReleaseDate> for ReleaseDateInput {
    fn into(self) -> ReleaseDate {
        ReleaseDate {
            year: self.year,
            month: self.month,
            day: self.day,
        }
    }
}

struct ReleaseDateValidator {}

impl InputValueValidator for ReleaseDateValidator {
    fn is_valid(&self, value: &Value) -> Result<(), String> {
        if let Value::Object(obj) = value {
            match obj.get("day") {
                Some(_) => match obj.get("month") {
                    Some(_) => Ok(()),
                    None => Err(Error::InvalidReleaseDate.into()),
                },
                None => Ok(()),
            }
        } else {
            Ok(())
        }
    }
}
