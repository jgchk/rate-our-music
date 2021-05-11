mod jwt;

use crate::errors::Error;
use crate::sql::Database;
use jwt::Jwt;

#[derive(Debug, Clone)]
pub struct Environment {
    db: Database,
    jwt: Jwt,
}

impl Environment {
    pub async fn new(database_url: &str, jwt_secret: &str) -> Result<Self, Error> {
        let db = Database::new(database_url).await?;
        let jwt = Jwt::new(jwt_secret);
        Ok(Self { db, jwt })
    }

    pub fn db(&self) -> &Database {
        &self.db
    }

    pub fn jwt(&self) -> &Jwt {
        &self.jwt
    }
}
