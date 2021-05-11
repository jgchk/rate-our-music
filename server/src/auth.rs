use crate::errors::Error;
use crate::{environment::Environment, model::role::Role};
use chrono::DateTime;
use chrono::Duration;
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Request {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i32,
    pub iat: i64,
    pub exp: i64,
    pub roles: Vec<Role>,
}

pub async fn create_token(
    env: &Environment,
    id: i32,
    lifetime: Duration,
) -> Result<(String, DateTime<Utc>), Error> {
    let issue_date = Utc::now();
    let expiration_date = issue_date + lifetime;
    let iat = issue_date.timestamp();
    let exp = expiration_date.timestamp();

    let account = env.db().account().get(id).await?;
    let roles = env.db().role().get_by_account(account.id).await?;

    let claims = Claims {
        sub: id,
        iat,
        exp,
        roles,
    };
    let token = env.jwt().encode(&claims)?;

    Ok((token, expiration_date))
}
