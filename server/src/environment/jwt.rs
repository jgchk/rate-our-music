use crate::auth;
use crate::errors::Error;
use jsonwebtoken::{
    decode, encode, Algorithm, DecodingKey, EncodingKey, Header, TokenData, Validation,
};

#[derive(Debug, Clone)]
pub struct Jwt {
    secret: String,
}

impl Jwt {
    pub fn new(secret: &str) -> Self {
        Self {
            secret: secret.to_owned(),
        }
    }

    pub fn encode(&self, claims: &auth::Claims) -> Result<String, Error> {
        let header = Header::new(Algorithm::HS512);
        let key = EncodingKey::from_secret(self.secret.as_bytes());
        let encoded = encode(&header, claims, &key)?;
        Ok(encoded)
    }

    pub fn decode(&self, token: &str) -> Result<TokenData<auth::Claims>, Error> {
        let key = DecodingKey::from_secret(self.secret.as_bytes());
        let validation = Validation::new(Algorithm::HS512);
        let decoded = decode::<auth::Claims>(token, &key, &validation)?;
        Ok(decoded)
    }
}
