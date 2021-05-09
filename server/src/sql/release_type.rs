use crate::{errors::Error, model::release_type::ReleaseType};
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct ReleaseTypeDatabase<'a>(&'a PgPool);

impl<'a> ReleaseTypeDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get_all(&self) -> Result<Vec<ReleaseType>, Error> {
        sqlx::query_as!(ReleaseType, "SELECT * FROM release_type")
            .fetch_all(self.0)
            .await
            .map_err(Error::from)
    }
}
