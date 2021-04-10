use async_graphql::{ComplexObject, Context, Result, SimpleObject};

#[derive(SimpleObject)]
#[graphql(complex)]
pub struct Genre {
    pub id: i32,
    pub parent_id: Option<i32>,
    pub name: String,
    pub description: Option<String>,
}

#[ComplexObject]
impl Genre {
    async fn parent(&self, ctx: &Context<'_>) -> Result<Option<Genre>> {
        match self.parent_id {
            Some(parent_id) => {
                let env = ctx.data::<crate::graphql::Context>()?;
                let genre = env.db().genre().get(parent_id).await?;
                Ok(Some(genre))
            }
            None => Ok(None),
        }
    }
}
