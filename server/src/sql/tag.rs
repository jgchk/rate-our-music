use crate::errors::Error;
use crate::model::tag::Tag;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct TagDatabase<'a>(&'a PgPool);

impl<'a> TagDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        account_id: i32,
        name: &str,
        description: Option<&str>,
    ) -> Result<Tag, Error> {
        let tag = sqlx::query!(
            "INSERT INTO tag (account_id, tag_name, tag_description)
            VALUES ($1, $2, $3)
            RETURNING tag_id",
            account_id,
            name,
            description
        )
        .fetch_one(self.0)
        .await?;
        Ok(Tag {
            tag_id: tag.tag_id,
            account_id,
            tag_name: name.to_string(),
            tag_description: description.map(String::from),
        })
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
