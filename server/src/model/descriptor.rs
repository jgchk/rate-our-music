use async_graphql::{Context, Object, Result};

pub struct Descriptor {
    pub descriptor_id: i32,
    pub descriptor_parent_id: Option<i32>,
    pub descriptor_name: String,
    pub descriptor_description: Option<String>,
    pub descriptor_is_graded: bool,
}

#[Object]
impl Descriptor {
    async fn id(&self) -> i32 {
        self.descriptor_id
    }

    async fn parent(&self, ctx: &Context<'_>) -> Result<Option<Descriptor>> {
        match self.descriptor_parent_id {
            Some(parent_id) => {
                let env = ctx.data::<crate::graphql::Context>()?;
                let descriptor = env.db().descriptor().get(parent_id).await?;
                Ok(Some(descriptor))
            }
            None => Ok(None),
        }
    }

    async fn name(&self) -> String {
        (&self.descriptor_name).to_string()
    }

    async fn description(&self) -> Option<String> {
        self.descriptor_description.as_ref().map(String::from)
    }

    async fn is_graded(&self) -> bool {
        self.descriptor_is_graded
    }
}
