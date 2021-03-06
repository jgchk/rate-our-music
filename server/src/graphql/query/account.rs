use crate::errors;
use crate::model::account::Account;
use async_graphql::*;

#[derive(Default)]
pub struct AccountQuery;

#[Object]
impl AccountQuery {
    async fn whoami(&self, ctx: &Context<'_>) -> Result<Account> {
        match ctx.data::<crate::graphql::Context>()?.session() {
            Some(session) => {
                let env = ctx.data::<crate::graphql::Context>()?;
                let account = env.db().account().get(session.user_id()).await?;
                Ok(account)
            }
            None => Err(errors::Error::InvalidCredentials.into()),
        }
    }

    async fn accounts(&self, ctx: &Context<'_>) -> Result<Vec<Account>> {
        let ctx = ctx.data::<crate::graphql::Context>()?;
        if ctx.is_authenticated() {
            let accounts = ctx.db().account().get_all().await?;
            Ok(accounts)
        } else {
            Err(errors::Error::InvalidCredentials.into())
        }
    }
}
