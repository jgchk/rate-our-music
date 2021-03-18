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

    async fn does_username_exist(&self, ctx: &Context<'_>, username: String) -> Result<bool> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get_by_username(&username).await?;
        Ok(account.is_some())
    }
}
