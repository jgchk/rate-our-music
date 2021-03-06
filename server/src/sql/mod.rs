mod account;

use crate::errors::Error;
use account::AccountDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct Database {
    pool: PgPool,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self, Error> {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(database_url)
            .await?;
        Ok(Self { pool })
    }

    pub fn account(&self) -> AccountDatabase {
        AccountDatabase::new(&self.pool)
    }
}
