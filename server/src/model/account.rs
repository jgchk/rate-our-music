use crate::errors::Error;
use async_graphql::{Context, Enum, Object, Result};
use serde::{Deserialize, Serialize};
use std::str::FromStr;

pub struct RawAccount {
    pub account_id: i32,
    pub username: String,
    pub password: String,
    pub roles: Option<Vec<String>>,
}

impl Into<Account> for RawAccount {
    fn into(self) -> Account {
        Account {
            account_id: self.account_id,
            username: self.username,
            password: self.password,
            roles: self
                .roles
                .unwrap_or_default()
                .iter()
                .filter_map(|role| Role::from_str(role).ok())
                .collect::<Vec<_>>(),
        }
    }
}

pub struct Account {
    pub account_id: i32,
    pub username: String,
    pub password: String,
    pub roles: Vec<Role>,
}

#[derive(Serialize, Deserialize, sqlx::Type, Debug, Clone, Copy, Enum, Eq, PartialEq)]
#[sqlx(type_name = "role")]
pub enum Role {
    Dev,
}

impl FromStr for Role {
    type Err = Error;
    fn from_str(s: &str) -> Result<Role, Self::Err> {
        match s {
            "DEV" => Ok(Role::Dev),
            _ => Err(Error::InvalidRole(s.to_string())),
        }
    }
}

impl ToString for Role {
    fn to_string(&self) -> String {
        match self {
            Role::Dev => "DEV".to_string(),
        }
    }
}

#[Object]
impl Account {
    async fn id(&self) -> i32 {
        self.account_id
    }

    async fn username(&self) -> String {
        (&self.username).to_string()
    }
}

pub struct Auth {
    pub token: String,
    pub exp: i64,
    pub account: Account,
}

#[Object]
impl Auth {
    async fn token(&self) -> String {
        (&self.token).to_string()
    }

    async fn exp(&self) -> i64 {
        self.exp
    }

    async fn account(&self, ctx: &Context<'_>) -> Result<Account> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let account = env.db().account().get(self.account.account_id).await?;
        Ok(account)
    }
}
