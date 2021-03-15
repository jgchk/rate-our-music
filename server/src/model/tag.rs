use crate::model::account::Account;
use async_graphql::{Context, Object, Result};

pub struct Tag {
    pub tag_id: i32,
    pub account_id: i32,
    pub tag_name: String,
    pub tag_description: Option<String>,
}

#[Object]
impl Tag {
    async fn id(&self) -> i32 {
        self.tag_id
    }

    async fn account(&self, ctx: &Context<'_>) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(self.account_id).await?;
        Ok(account)
    }

    async fn name(&self) -> String {
        (&self.tag_name).to_string()
    }

    async fn description(&self) -> Option<String> {
        self.tag_description.as_ref().map(String::from)
    }
}
