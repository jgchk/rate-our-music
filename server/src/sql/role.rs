use crate::errors::Error;
use crate::model::role::Role;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct RoleDatabase<'a>(&'a PgPool);

impl<'a> RoleDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get_by_account(&self, account_id: i32) -> Result<Vec<Role>, Error> {
        sqlx::query_as!(
            Role,
            "SELECT *
            FROM role
            WHERE id IN (
                SELECT role_id
                FROM account_role
                WHERE account_id = $1
            )",
            account_id
        )
        .fetch_all(self.0)
        .await
        .map_err(Error::from)
    }
}
