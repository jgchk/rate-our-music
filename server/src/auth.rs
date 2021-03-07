use crate::environment::Environment;
use crate::errors::Error;
use redis::AsyncCommands;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize)]
pub struct Request {
    username: String,
    password: String,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub id: i64,
    pub iat: u64,
    pub exp: u64,
}

pub fn create_token(env: &Environment, id: i64, exp: Duration) -> Result<(String, u64), Error> {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    let iat = since_the_epoch.as_secs();
    let exp = since_the_epoch
        .checked_add(exp)
        .map_or(iat, |exp| exp.as_secs());
    let claims = Claims { id, iat, exp };
    let token = env.jwt().encode(&claims)?;
    Ok((token, exp))
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
