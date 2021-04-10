use crate::errors::Error;
use crate::model::account::Account;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct AccountDatabase<'a>(&'a PgPool);

impl<'a> AccountDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(&self, username: &str, password: &str) -> Result<Account, Error> {
        sqlx::query_as!(
            Account,
            "INSERT INTO account (username, password)
            VALUES ($1, crypt($2, gen_salt('bf')))
            RETURNING *",
            username,
            password,
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get(&self, id: i32) -> Result<Account, Error> {
        sqlx::query_as!(
            Account,
            "SELECT *
            FROM account
            WHERE id = $1",
            id
        )
        .fetch_one(self.0)
        .await
        .map_err(Error::from)
    }

    pub async fn get_by_login(
        &self,
        username: &str,
        password: &str,
    ) -> Result<Option<Account>, Error> {
        sqlx::query_as!(
            Account,
            "SELECT *
            FROM account
            WHERE username = $1 AND password = crypt($2, password)",
            username,
            password
        )
        .fetch_optional(self.0)
        .await
        .map_err(Error::from)
    }
}
