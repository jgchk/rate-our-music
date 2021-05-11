use crate::environment::Environment;
use crate::errors::Error;
use crate::{auth, model::role::Role};
use jsonwebtoken::TokenData;

#[derive(Debug)]
pub struct Session {
    token: TokenData<auth::Claims>,
}

impl Session {
    pub fn new(env: &Environment, raw_token: &str) -> Result<Self, Error> {
        let raw_token = raw_token.trim_start_matches("Bearer ").to_owned();
        let token = match env.jwt().decode(&raw_token) {
            Ok(token) => token,
            Err(err) => return Err(err),
        };

        Ok(Self { token })
    }

    pub fn account_id(&self) -> i32 {
        self.token.claims.sub
    }

    pub fn roles(&self) -> &Vec<Role> {
        &self.token.claims.roles
    }
}
