use crate::errors::Error;
use crate::model::account::Account;
use crate::model::account::RawAccount;
use crate::model::account::Role;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct AccountDatabase<'a>(&'a PgPool);

impl<'a> AccountDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        username: &str,
        password: &str,
        roles: Vec<Role>,
    ) -> Result<Account, Error> {
        let account = sqlx::query!(
            "INSERT INTO account (username, password, roles) VALUES ($1, crypt($2, gen_salt('bf')), $3::role[]) RETURNING account_id",
            username,
            password,
            roles.iter().map(|role| role.to_string()).collect::<Vec<String>>() as Vec<String>
        )
        .fetch_one(self.0)
        .await?;
        Ok(Account {
            account_id: account.account_id,
            username: username.to_string(),
            password: password.to_string(),
            roles,
        })
    }

    pub async fn get(&self, id: i32) -> Result<Account, Error> {
        let account = sqlx::query_as!(
            RawAccount,
            r#"SELECT
                account_id,
                username,
                password,
                roles as "roles: Vec<String>"
            FROM account
            WHERE account_id = $1"#,
            id
        )
        .fetch_one(self.0)
        .await?;
        Ok(account.into())
    }

    pub async fn get_by_login(
        &self,
        username: &str,
        password: &str,
    ) -> Result<Option<Account>, Error> {
        let maybe_account = sqlx::query_as!(
            RawAccount,
            r#"SELECT
                account_id,
                username,
                password,
                roles as "roles: Vec<String>"
            FROM account
            WHERE username = $1 AND password = crypt($2, password)"#,
            username,
            password
        )
        .fetch_optional(self.0)
        .await?;

        Ok(maybe_account.map(|account| account.into()))
    }
}
