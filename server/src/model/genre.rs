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
