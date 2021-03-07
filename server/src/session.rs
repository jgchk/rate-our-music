use crate::auth;
use crate::auth::is_token_revoked;
use crate::auth::revoke_token;
use crate::environment::Environment;
use crate::errors::Error;
use jsonwebtoken::TokenData;

pub struct Session {
    env: Environment,
    raw_jwt: String,
    jwt: TokenData<auth::Claims>,
}

impl Session {
    pub async fn new(env: Environment, raw_jwt: &str) -> Result<Option<Self>, Error> {
        let raw_jwt = raw_jwt.trim_start_matches("Bearer ").to_owned();
        let jwt = match env.jwt().decode(&raw_jwt) {
            Ok(jwt) => jwt,
            Err(err) => match err {
                Error::JWTError(_) => return Ok(None),
                _ => return Err(err),
            },
        };

        match is_token_revoked(&env, &raw_jwt).await? {
            true => Ok(None),
            false => Ok(Some(Self { env, raw_jwt, jwt })),
        }
    }

    pub fn user_id(&self) -> i64 {
        self.jwt.claims.id
    }

    pub async fn invalidate(&self) -> Result<(), Error> {
        revoke_token(
            &self.env,
            &self.raw_jwt,
            (self.jwt.claims.exp - self.jwt.claims.iat) as usize,
        )
        .await
    }
}
