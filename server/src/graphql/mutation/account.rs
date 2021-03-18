use crate::auth;
use crate::errors;
use crate::model::account::Auth;
use crate::Environment;
use async_graphql::*;
use chrono::Duration;
use warp::http;

pub struct AccountMutation;

#[Object]
impl AccountMutation {
    async fn register(
        &self,
        ctx: &Context<'_>,
        username: String,
        password: String,
    ) -> Result<Auth> {
        if password.len() == 0 || password.len() > 64 {
            return Err(errors::Error::InvalidPasswordLength(1, 64).into());
        }

        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env
            .db()
            .account()
            .create(&username, &password, Vec::new())
            .await?;
        let (token, exp) = make_token(env, account.account_id).await?;
        make_refresh_token(env, ctx, account.account_id).await?;

        Ok(Auth {
            token,
            exp,
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

        let (token, exp) = make_token(env, account.account_id).await?;
        make_refresh_token(env, ctx, account.account_id).await?;

        Ok(Auth {
            token,
            exp,
            account,
        })
    }

    async fn logout(&self, ctx: &Context<'_>, force: bool) -> Result<bool> {
        if let Some(refresh_session) = ctx.data::<crate::graphql::Context>()?.refresh_session() {
            if force {
                refresh_session.invalidate().await?;
            }
            ctx.append_http_header(
                http::header::SET_COOKIE,
                "refresh_token=; expires=expires=Thu, 01 Jan 1970 00:00:00 GMT".to_string(),
            );
        }

        match ctx.data::<crate::graphql::Context>()?.session() {
            Some(session) => {
                session.invalidate().await?;
                Ok(true)
            }
            None => Err(errors::Error::InvalidCredentials.into()),
        }
    }

    async fn refresh_auth(&self, ctx: &Context<'_>) -> Result<Auth> {
        match ctx.data::<crate::graphql::Context>()?.refresh_session() {
            Some(refresh_session) => {
                let env = ctx.data::<crate::graphql::Context>()?;
                let account_id = refresh_session.account_id();
                let account = env.db().account().get(account_id).await?;
                let (token, exp) = make_token(env, account_id).await?;
                Ok(Auth {
                    token,
                    exp,
                    account,
                })
            }
            None => Err(errors::Error::InvalidCredentials.into()),
        }
    }
}

async fn make_token(env: &Environment, id: i32) -> Result<(String, i64), Error> {
    let expires_in = Duration::hours(1);
    let (token, exp) = auth::create_token(env, id, expires_in).await?;
    Ok((token, exp.timestamp()))
}

async fn make_refresh_token(
    env: &Environment,
    ctx: &Context<'_>,
    id: i32,
) -> Result<(String, i64), Error> {
    let expires_in = Duration::days(365);
    let (refresh_token, exp) = auth::create_token(env, id, expires_in).await?;
    ctx.append_http_header(
        http::header::SET_COOKIE,
        format!(
            "refresh_token={}; Expires={}; HttpOnly",
            refresh_token,
            exp.format("%a, %d %b %Y %T %Z")
        ),
    );
    Ok((refresh_token, exp.timestamp()))
}
