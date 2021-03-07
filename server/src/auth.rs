use chrono::DateTime;
use chrono::Utc;
use chrono::Duration;
use crate::environment::Environment;
use crate::errors::Error;
use redis::AsyncCommands;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Request {
    username: String,
    password: String,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub id: i64,
    pub iat: i64,
    pub exp: i64,
}

pub fn create_token(env: &Environment, id: i64, lifetime: Duration) -> Result<(String, DateTime<Utc>), Error> {
    let issue_date = Utc::now();
    let expiration_date = issue_date + lifetime;

    let iat = issue_date.timestamp();
    let exp = expiration_date.timestamp();

    let claims = Claims { id, iat, exp };
    let token = env.jwt().encode(&claims)?;

    Ok((token, expiration_date))
}

pub async fn revoke_token(env: &Environment, token: &str, exp_seconds: usize) -> Result<(), Error> {
    env.redis()
        .await?
        .set_ex(token, true, exp_seconds)
        .await
        .map_err(|err| err.into())
}

pub async fn is_token_revoked(env: &Environment, token: &str) -> Result<bool, Error> {
    env.redis()
        .await?
        .get(token)
        .await
        .map_err(|err| err.into())
}
