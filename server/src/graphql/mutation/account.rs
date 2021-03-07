use crate::auth;
use crate::errors;
use crate::model::account::Auth;
use crate::Environment;
use async_graphql::*;
use std::time::Duration;
use warp::http;

#[derive(Default)]
pub struct AccountMutation;

#[Object]
impl AccountMutation {
    async fn create_account(
        &self,
        ctx: &Context<'_>,
        username: String,
        password: String,
    ) -> Result<Auth> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let id = env.db().account().create(&username, &password).await?;
        let account = env.db().account().get(id).await?;
        let (token, exp) = make_token(env, account.id)?;
        make_refresh_token(env, ctx, account.id)?;

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

        let (token, exp) = make_token(env, account.id)?;
        make_refresh_token(env, ctx, account.id)?;

        Ok(Auth {
            token,
            exp,
            account,
        })
    }

    async fn logout(&self, ctx: &Context<'_>) -> Result<bool> {
        if let Some(refresh_session) = ctx.data::<crate::graphql::Context>()?.refresh_session() {
            refresh_session.invalidate().await?;
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
                let account = env.db().account().get(refresh_session.user_id()).await?;
                let (token, exp) = make_token(env, account.id)?;
                Ok(Auth {
                    token,
                    exp,
                    account,
                })
            }
            None => Err(errors::Error::InvalidCredentials.into())
        }
    }
}

const EXPIRES_IN: Duration = Duration::from_secs(10);
const REFRESH_EXPIRES_IN: Duration = Duration::from_secs(60 * 60);

fn make_token(env: &Environment, id: i64) -> Result<(String, u64), Error> {
    let (token, exp) = auth::create_token(env, id, EXPIRES_IN)?;
    Ok((token, exp))
}

fn make_refresh_token(
    env: &Environment,
    ctx: &Context<'_>,
    id: i64,
) -> Result<(String, u64), Error> {
    let (refresh_token, exp) = auth::create_token(env, id, REFRESH_EXPIRES_IN)?;
    ctx.append_http_header(
        http::header::SET_COOKIE,
        format!("refresh_token={}; HttpOnly", refresh_token),
    );
    Ok((refresh_token, exp))
}
