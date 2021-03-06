use crate::auth;
use crate::errors;
use crate::model::account::Auth;
use async_graphql::*;
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
        let jwt = auth::create_token(env, account.id)?;

        ctx.insert_http_header(http::header::SET_COOKIE, format!("jwt={}", jwt));

        Ok(Auth {
            token: jwt,
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
        let jwt = auth::create_token(env, account.id)?;

        ctx.insert_http_header(http::header::SET_COOKIE, format!("jwt={}", jwt));

        Ok(Auth {
            token: jwt,
            account,
        })
    }

    async fn logout(&self, ctx: &Context<'_>) -> Result<bool> {
        match ctx.data::<crate::graphql::Context>()?.session() {
            Some(session) => {
                session.invalidate().await?;
                Ok(true)
            }
            None => Err(errors::Error::InvalidCredentials.into()),
        }
    }

    async fn refresh_auth(&self, ctx: &Context<'_>) -> Result<Auth> {
        match ctx.data::<crate::graphql::Context>()?.session() {
            Some(session) => {
                let env = ctx.data::<crate::graphql::Context>()?;
                let account = env.db().account().get(session.user_id()).await?;
                let jwt = auth::create_token(env, account.id)?;
                ctx.insert_http_header(http::header::SET_COOKIE, format!("jwt={}", jwt));
                Ok(Auth {
                    token: jwt,
                    account,
                })
            }
            None => Err(errors::Error::InvalidCredentials.into()),
        }
    }
}
