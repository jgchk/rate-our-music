use crate::model::account::Account;
use async_graphql::*;

pub struct AccountQuery;

#[Object]
impl AccountQuery {
    async fn get(&self, ctx: &Context<'_>, id: i32) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(id).await?;
        Ok(account)
    }
}
