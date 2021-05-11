use crate::errors;
use crate::model::account::Auth;
use crate::Environment;
use crate::{auth, session::Session};
use async_graphql::*;
use chrono::Duration;

pub struct AccountMutation;

#[Object]
impl AccountMutation {
    async fn register(
        &self,
        ctx: &Context<'_>,
        username: String,
        password: String,
    ) -> Result<Auth> {
        if username.len() < 1 || username.len() > 64 {
            return Err(errors::Error::InvalidUsernameLength(1, 64).into());
        }
        if password.len() < 1 || password.len() > 64 {
            return Err(errors::Error::InvalidPasswordLength(1, 64).into());
        }

        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().create(&username, &password).await?;
        let (token, _) = make_token(env, account.id).await?;
        let (refresh_token, _) = make_refresh_token(env, account.id).await?;

        Ok(Auth {
            token,
            refresh_token,
            account,
        })
    }

    async fn login(&self, ctx: &Context<'_>, username: String, password: String) -> Result<Auth> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = match env
            .db()
            .account()
            .get_by_login(&username, &password)
            .await?
        {
            Some(user) => user,
            None => return Err(errors::Error::InvalidCredentials.into()),
        };

        let (token, _) = make_token(env, account.id).await?;
        let (refresh_token, _) = make_refresh_token(env, account.id).await?;

        Ok(Auth {
            token,
            refresh_token,
            account,
        })
    }

    async fn logout(&self, ctx: &Context<'_>) -> Result<bool> {
        match ctx.data::<crate::graphql::Context>()?.session() {
            Some(_) => Ok(true),
            None => Err(errors::Error::InvalidCredentials.into()),
        }
    }

    async fn refresh(&self, ctx: &Context<'_>, refresh_token: String) -> Result<Auth> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let session = Session::new(env.env(), &refresh_token);
        match session {
            Ok(refresh_session) => {
                let account_id = refresh_session.account_id();
                let account = env.db().account().get(account_id).await?;
                let (token, _) = make_token(env, account_id).await?;
                let (refresh_token, _) = make_refresh_token(env, account_id).await?;
                Ok(Auth {
                    token,
                    refresh_token,
                    account,
                })
            }

            _ => Err(errors::Error::InvalidCredentials.into()),
        }
    }
}

async fn make_token(env: &Environment, id: i32) -> Result<(String, i64), Error> {
    let expires_in = Duration::hours(1);
    let (token, exp) = auth::create_token(env, id, expires_in).await?;
    Ok((token, exp.timestamp()))
}

async fn make_refresh_token(env: &Environment, id: i32) -> Result<(String, i64), Error> {
    let expires_in = Duration::days(365);
    let (refresh_token, exp) = auth::create_token(env, id, expires_in).await?;
    Ok((refresh_token, exp.timestamp()))
}
