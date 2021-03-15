use crate::errors::Error;
use crate::model::tag::Tag;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct TagDatabase<'a>(&'a PgPool);

impl<'a> TagDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get(&self, id: i32) -> Result<Tag, Error> {
        sqlx::query_as!(Tag, "SELECT * FROM tag WHERE tag_id = $1", id)
            .fetch_one(self.0)
            .await
            .map_err(|e| e.into())
    }

    pub async fn get_by_release_and_account(
        &self,
        release_id: i32,
        account_id: i32,
    ) -> Result<Vec<Tag>, Error> {
        sqlx::query_as!(
            Tag,
            "SELECT t.*
            FROM tag t
            JOIN release_tag rt ON t.tag_id = rt.tag_id
            WHERE rt.release_id = $1 AND t.account_id = $2",
            release_id,
            account_id
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
    }
}
