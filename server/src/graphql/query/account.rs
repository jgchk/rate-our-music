use crate::{errors::Error, model::account::Account};
use async_graphql::*;

pub struct AccountQuery;

#[Object]
impl AccountQuery {
    async fn get(&self, ctx: &Context<'_>, id: i32) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(id).await?;
        Ok(account)
    }

    async fn whoami(&self, ctx: &Context<'_>) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        match env.session() {
            Some(session) => {
                let account = env.db().account().get(session.account_id()).await?;
                Ok(account)
            }

            None => Err(Error::InvalidCredentials.into()),
        }
    }
}
