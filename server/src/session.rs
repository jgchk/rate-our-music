use crate::auth;
use crate::auth::is_token_revoked;
use crate::auth::revoke_token;
use crate::environment::Environment;
use crate::errors::Error;
use jsonwebtoken::TokenData;

pub struct Session {
    env: Environment,
    raw_token: String,
    token: TokenData<auth::Claims>,
}

impl Session {
    pub async fn new(env: Environment, raw_token: &str) -> Result<Option<Self>, Error> {
        let raw_token = raw_token.trim_start_matches("Bearer ").to_owned();
        let token = match env.jwt().decode(&raw_token) {
            Ok(token) => token,
            Err(err) => match err {
                Error::JWTError(_) => return Ok(None),
                _ => return Err(err),
            },
        };

        match is_token_revoked(&env, &raw_token).await? {
            true => Ok(None),
            false => Ok(Some(Self { env, raw_token, token })),
        }
    }

    pub fn user_id(&self) -> i64 {
        self.token.claims.id
    }

    pub async fn invalidate(&self) -> Result<(), Error> {
        revoke_token(
            &self.env,
            &self.raw_token,
            (self.token.claims.exp - self.token.claims.iat) as usize,
        )
        .await
    }
}
