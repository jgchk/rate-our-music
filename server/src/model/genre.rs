use async_graphql::{Context, Object, Result};

pub struct Genre {
    pub genre_id: i32,
    pub genre_parent_id: Option<i32>,
    pub genre_name: String,
    pub genre_description: Option<String>,
}

#[Object]
impl Genre {
    async fn id(&self) -> i32 {
        self.genre_id
    }

    async fn parent(&self, ctx: &Context<'_>) -> Result<Option<Genre>> {
        match self.genre_parent_id {
            Some(parent_id) => {
                let env = ctx.data::<crate::graphql::Context>()?;
                let genre = env.db().genre().get(parent_id).await?;
                Ok(Some(genre))
            }
            None => Ok(None),
        }
    }

    async fn name(&self) -> String {
        (&self.genre_name).to_string()
    }

    async fn description(&self) -> Option<String> {
        match &self.genre_description {
            Some(description) => Some(description.to_string()),
            None => None,
        }
    }
}

pub struct ReleaseGenre {
    pub release_id: i32,
    pub genre: Genre,
}

impl ReleaseGenre {
    pub fn new(release_id: i32, genre: &Genre) -> Self {
        Self {
            release_id,
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
impl ReleaseGenre {
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
            .genre_vote()
            .get_by_release_genre(self.release_id, self.genre.genre_id)
            .await?;
        let sum = votes
            .iter()
            .map(|vote| vote.release_genre_vote_value as i32)
            .sum::<i32>();
        let avg = (sum as f64) / (votes.len() as f64);
        Ok(avg)
    }
}
