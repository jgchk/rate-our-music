use super::genre::Genre;
use async_graphql::{Context, Object, Result};

pub struct TrackGenre {
    pub track_id: i32,
    pub genre: Genre,
}

impl TrackGenre {
    pub fn new(track_id: i32, genre: &Genre) -> Self {
        Self {
            track_id,
            genre: Genre {
                genre_id: genre.genre_id,
                genre_parent_id: genre.genre_parent_id,
                genre_name: (&genre.genre_name).to_string(),
                genre_description: genre.genre_description.as_ref().map(String::from),
            },
        }
    }
}

#[Object]
impl TrackGenre {
    async fn id(&self) -> i32 {
        self.genre.genre_id
    }

    async fn parent(&self, ctx: &Context<'_>) -> Result<Option<Genre>> {
        match self.genre.genre_parent_id {
            Some(parent_id) => {
                let env = ctx.data::<crate::graphql::Context>()?;
                let genre = env.db().genre().get(parent_id).await?;
                Ok(Some(genre))
            }
            None => Ok(None),
        }
    }

    async fn name(&self) -> String {
        (&self.genre.genre_name).to_string()
    }

    async fn description(&self) -> Option<String> {
        match &self.genre.genre_description {
            Some(description) => Some(description.to_string()),
            None => None,
        }
    }

    async fn weight(&self, ctx: &Context<'_>) -> Result<f64> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let votes = env
            .db()
            .track_genre_vote()
            .get_by_track_genre(self.track_id, self.genre.genre_id)
            .await?;
        let sum = votes
            .iter()
            .map(|vote| vote.track_genre_vote_value as i32)
            .sum::<i32>();
        let avg = (sum as f64) / (votes.len() as f64);
        Ok(avg)
    }
}
