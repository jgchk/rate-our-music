use crate::errors;
use crate::model::account::Account;
use async_graphql::*;

pub struct AccountQuery;

#[Object]
impl AccountQuery {
    async fn me(&self, ctx: &Context<'_>) -> Result<Account> {
        match ctx.data::<crate::graphql::Context>()?.session() {
            Some(session) => {
                let env = ctx.data::<crate::graphql::Context>()?;
                let account = env.db().account().get(session.account_id()).await?;
                Ok(account)
            }
            None => Err(errors::Error::InvalidCredentials.into()),
        }
    }
}
