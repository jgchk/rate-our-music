use crate::model::account::Account;
use sqlx::{Error, PgPool};

#[derive(Debug, Clone)]
pub struct AccountDatabase<'a>(&'a PgPool);

impl<'a> AccountDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(&self, username: &str, password: &str) -> Result<i64, Error> {
        let account = sqlx::query!(
            "INSERT INTO account (username, password) VALUES ($1, crypt($2, gen_salt('bf'))) RETURNING id",
            username,
            password
        )
        .fetch_one(self.0)
        .await?;
        Ok(account.id)
    }

    pub async fn get(&self, id: i64) -> Result<Account, Error> {
        sqlx::query_as!(Account, "SELECT * FROM account WHERE id = $1", id)
            .fetch_one(self.0)
            .await
    }

    pub async fn get_all(&self) -> Result<Vec<Account>, Error> {
        sqlx::query_as!(Account, "SELECT * FROM account")
            .fetch_all(self.0)
            .await
    }

    pub async fn get_by_login(
        &self,
        username: &str,
        password: &str,
    ) -> Result<Option<Account>, Error> {
        sqlx::query_as!(
            Account,
            "SELECT * FROM account WHERE username = $1 AND password = crypt($2, password)",
            username,
            password
        )
        .fetch_optional(self.0)
        .await
    }
}
