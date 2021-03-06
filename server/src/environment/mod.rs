mod jwt;

use crate::errors::Error;
use crate::sql::Database;
use jwt::Jwt;

#[derive(Debug, Clone)]
pub struct Environment {
    db: Database,
    redis: redis::Client,
    jwt: Jwt,
}

impl Environment {
    pub async fn new(database_url: &str, redis_url: &str, jwt_secret: &str) -> Result<Self, Error> {
        let db = Database::new(database_url).await?;
        let redis = redis::Client::open(redis_url)?;
        let jwt = Jwt::new(jwt_secret);
        Ok(Self { db, redis, jwt })
    }

    pub fn db(&self) -> &Database {
        &self.db
    }

    pub async fn redis(&self) -> Result<redis::aio::MultiplexedConnection, Error> {
        self.redis
            .get_multiplexed_tokio_connection()
            .await
            .map_err(|err| err.into())
    }

    pub fn jwt(&self) -> &Jwt {
        &self.jwt
    }
}
